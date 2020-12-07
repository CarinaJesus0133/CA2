module.exports = `
CREATE TABLE IF NOT EXISTS appointment (
  id INTEGER PRIMARY KEY,
  hairdresser_id INTEGER NOT NULL,
  customer_id INTEGER NULL,
  appointment_date date NOT NULL,
  appointment_time varchar(5)  NOT NULL,
  available INTEGER NOT NULL,
  CONSTRAINT customer_appointment_id FOREIGN KEY (customer_id) REFERENCES customer (id) ,
  CONSTRAINT hairdresser_appointment_fk FOREIGN KEY (hairdresser_id) REFERENCES hairdresser (id) 
);

CREATE TABLE IF NOT EXISTS customer (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  CONSTRAINT user_costumer_fk FOREIGN KEY (user_id) REFERENCES user (id) 
);

CREATE TABLE IF NOT EXISTS hairdresser (
  id INTEGER PRIMARY KEY,
  user INTEGER NOT NULL,
  location varchar(255) NOT NULL,
  CONSTRAINT user_hairdresser_pk FOREIGN KEY (user) REFERENCES user (id) 
);

CREATE TABLE IF NOT EXISTS rating (
  id INTEGER PRIMARY KEY,
  appointment INTEGER NOT NULL,
  text text NOT NULL,
  CONSTRAINT appointment_rating FOREIGN KEY (appointment) REFERENCES appointment (hairdresser_id) 
) ;

CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY,
  email varchar(45) NOT NULL,
  password varchar(45) NOT NULL,
  name varchar(45) NOT NULL,
  phone varchar(45) NOT NULL,
  user_type INTEGER NOT NULL
  ) ;
`