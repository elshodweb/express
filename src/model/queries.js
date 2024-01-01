export const authQuery = {
  register: `INSERT INTO "users" (name,firstname,password,email) VALUES($1,$2,$3,$4) returning *;`,
  login: `SELECT * FROM  users where email = $1 ;`,
  confirm: `UPDATE USERS SET confirmed_email = TRUE WHERE email = $1 returning *;`,
};

export const usersQuery = {
  getSelf: `Select * from users where id = $1;`,
  update: `UPDATE USERS SET name = $1 , firstname = $2, password = $3, email = $4 , image = $5 WHERE id = $6 returning *;`,
  get: `Select * from users;`,
};
