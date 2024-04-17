interface IUserqueries {
  getUser: string;
  createUser: string;
}

export const userQueries: IUserqueries = {
  getUser: `SELECT * FROM users WHERE username = $1`,

  createUser: `INSERT INTO users (
        username, password
    ) VALUES ($1, $2) RETURNING *`,
};
