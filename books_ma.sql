create database books_ma;
create table books
(
books_id int not null auto_increment,
ISBN char(13) not null,
books_name varchar(30) not null,
author varchar(30) null,
publisher varchar(30) null,
publish_date date null,
class varchar(20) not null,
books_language varchar(20) not null,
price decimal(8,2) null,
quantity int not null default 1,
primary key(books_id)
);
create table users
(
users_id int not null auto_increment,
users_name varchar(30) not null,
users_password varchar(30) not null,
grade int not null default 1,
tel char(11) not null,
email varchar(30) null,
birthday date null,
sex int not null,
true_name varchar(30) not null,
primary key(users_id)
);
create table borrow
(
borrow_id int not null auto_increment,
users_id int,
borrow_date date not null,
primary key(borrow_id),
constraint fk_borrow_users 
foreign key (users_id) references users(users_id)
);
create table borrow_book
(
bb_id int not null auto_increment,
borrow_id int,
books_id int,
quantity int not null default 1,
primary key(bb_id),
constraint fk_bb_borrow
foreign key (borrow_id) references borrow(borrow_id),
constraint fk_bb_books
foreign key (books_id) references books(books_id)
);
create table boards
(id int auto_increment not null,
send_date date not null,
adj_date date not null,
title varchar(20) not null,
content varchar(1000) not null,
primary key(id)
);

create user books_ma_admin identified by '102938';
create user books_ma_users identified by '120938';
grant select on books_ma.* to 'books_ma_users';
grant insert on books_ma.borrow to 'books_ma_users';
grant insert on books_ma.borrow_book to 'books_ma_users';
grant insert on books_ma.users to 'books_ma_users';
grant update on books_ma.borrow to 'books_ma_users';
grant update on books_ma.users to 'books_ma_users';
grant update(quantity) on books_ma.books to 'books_ma_users';
grant select,insert,update,delete on books_ma.* to 'books_ma_admin';