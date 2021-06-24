-- users table insert
INSERT INTO users (name, email, password)
VALUES ('Mickey Mouse', 'mickey@dsn.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Donald Duck', 'donaldd@dsn.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Pooh Bear','pooh@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

-- properties table insert
INSERT INTO properties (title, description, owner_id, cover_photo_url, thumbnail_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, active, province, city, country, street, post_code) 
VALUES ('Hen House', 'description', 1, 'https://i.pinimg.com/originals/5d/e5/56/5de55678d168903d8346c2dc790c793a.jpg', 'https://i.ytimg.com/vi/6KZ6TWx0khA/maxresdefault.jpg', 500, 1, 1, 2, true, 'M Country', 'M Avenue', 'M City', 'M Province', 'M12345'),
('Beehive Mansion', 'description', 2, 'https://i.etsystatic.com/13235593/r/il/51a31b/1430292632/il_570xN.1430292632_ji4h.jpg', 'https://www.familyhandyman.com/wp-content/uploads/2019/07/FHD19JUNE_BeeBox_251-hive-featured-photo.jpg', 1000, 2, 2, 4, true, 'B Country', 'B Avenue', 'B City', 'B Province', 'B22345'),
('Cookie Jar House', 'description', 1, 'https://i.pinimg.com/originals/f4/ed/2b/f4ed2b89c8fab75c082e1531a00c7347.jpg', 'https://images-na.ssl-images-amazon.com/images/I/81%2Bi7hZeUrL._AC_SL1500_.jpg', 800, 1, 1, 2, true,  'C Country', 'C Avenue', 'C City', 'C Province', 'C32345');

-- reservations table insert
INSERT INTO reservations (guest_id, property_id, start_date, end_date)
VALUES (3, 2, '2021-01-15', '2021-01-17'),
(2, 1, '2021-02-01', '2021-02-03'),
(3, 3, '2021-02-15', '2021-01-17'),
(3, 1, '2021-03-15', '2021-03-17');

-- property_reviews table insert
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (3, 2, 1, 3, 'message'),
(2, 1, 2, 1, 'message'),
(3, 3, 3, 5, 'message'),
(3, 1, 4, 1, 'message');