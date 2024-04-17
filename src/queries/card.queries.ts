interface ICardqueries {
  createCard: string;
  fetchDisplayCard: string;
  fetchCardById: string;
  editCard: string;
  deleteCard: string;
  fetchAllUserCards: string;
  fetchSearchedUserCards: string;
  cardWronglyCorrectly: string;
  zeroCardWronglyCorrectly: string;
  setCardToNeverTime: string;
  increaseCardTime: string;
  setCardAsHardToAnswer: string;
}

export const cardQueries: ICardqueries = {
  createCard: `
        INSERT INTO cards (
            word,
            definition,
            user_id
        ) VALUES ($1, $2, $3) RETURNING *
    `,
  fetchDisplayCard: `
    WITH PreferredCards AS (
        SELECT 
            id,
            word,
            definition,
            bin,
            time_to_appear,
            ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY bin DESC, time_to_appear) AS row_num
        FROM 
            cards
        WHERE 
            cards.user_id = $1 AND COALESCE((bin::int > 0 AND bin::int <= 11 AND time_to_appear <= NOW()), bin = '0')
        ORDER BY bin DESC
        LIMIT 1
    ),
    ZeroCard AS (
        SELECT 
            id,
            word,
            definition,
            bin,
            time_to_appear,
            ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY bin DESC, time_to_appear) AS row_num
        FROM 
            cards
        WHERE 
            cards.user_id = $1 AND bin::int = 0
        OFFSET floor(RANDOM() * (SELECT COUNT(*) FROM cards WHERE cards.user_id = $1 AND bin::int = 0))
        LIMIT 1
    ),
    BinCounts AS (
        SELECT 
            json_agg(json_build_object('bin', bins.bin_number, 'count', COALESCE(card_counts.count, 0))) AS bins_and_counts
        FROM 
            generate_series(0, 12) AS bins(bin_number)
        LEFT JOIN (
            SELECT 
                bin::int AS bin_number,
                COUNT(*) AS count
            FROM 
                cards
            WHERE cards.user_id = $1
            GROUP BY 
                bin::int
        ) AS card_counts ON bins.bin_number = card_counts.bin_number
    ),
    AreCardsDone AS (
        SELECT count(id) FROM cards WHERE user_id = $1 AND bin::int < '11'
    )
    SELECT 
        COALESCE(zc.id, pc.id) AS id,
        COALESCE(zc.word, pc.word) AS word,
        COALESCE(zc.bin, pc.bin) AS bin,
        COALESCE(zc.definition, pc.definition) AS definition,
        COALESCE(bc.bins_and_counts, '[]') AS bins,
        CASE
            WHEN acd.count > 0 THEN FALSE
            ELSE TRUE
        END AS are_cards_done
    FROM 
        users u
    LEFT JOIN
        PreferredCards pc ON TRUE
    LEFT JOIN
        ZeroCard zc ON TRUE
    LEFT JOIN 
        BinCounts bc ON TRUE
    LEFT JOIN
        AreCardsDone acd ON TRUE
    WHERE u.id = $1;
    `,
  fetchCardById: `
        SELECT * FROM cards WHERE id = $1;
    `,
  editCard: `
        UPDATE cards SET word = $1, definition = $2 WHERE id = $3 RETURNING *
    `,
  deleteCard: `
        DELETE FROM cards WHERE id = $1 RETURNING *;
    `,
  fetchAllUserCards: `
        SELECT
            id,
            word,
            definition,
            bin,
            time_to_appear,
            wrongly_answered_count,
            user_id,
            created_at,
            updated_at
        FROM cards
        WHERE user_id = $1;
    `,
  fetchSearchedUserCards: `
        SELECT
            id,
            word,
            definition,
            bin,
            time_to_appear,
            wrongly_answered_count
        FROM cards
        WHERE user_id = $1 AND word ILIKE $2;
    `,
  cardWronglyCorrectly: `
        UPDATE cards SET time_to_appear = CURRENT_TIMESTAMP + INTERVAL '5 seconds', bin = '1', wrongly_answered_count = wrongly_answered_count + 1, updated_at = NOW() WHERE id = $1
    `,
  zeroCardWronglyCorrectly: `
        UPDATE cards SET wrongly_answered_count = wrongly_answered_count + 1, updated_at = NOW() WHERE id = $1
    `,
  setCardToNeverTime: `
        UPDATE cards SET time_to_appear = 'infinity'::timestamp, bin = '11' WHERE id = $1;
    `,
  increaseCardTime: `
        UPDATE cards SET time_to_appear = CURRENT_TIMESTAMP + INTERVAL $2, bin = $3 WHERE id = $1;
    `,
  setCardAsHardToAnswer: `
    UPDATE cards SET time_to_appear = 'infinity'::timestamp, bin = '12' WHERE id = $1;
    `,
};
