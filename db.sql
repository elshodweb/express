create table "users" (
  id uuid default  uuid_generate_v4() primary key,
  name varchar not null,
  firstname varchar not null,
  password varchar not null,
  email varchar not null,
  confirm_email boolean,
  image varchar 
);