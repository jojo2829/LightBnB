const properties = require('./json/properties.json');
//const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1;`, [email])
    .then((result) => {
      console.log(result.rows);
      return Promise.resolve(result.rows[0]);
    })
    .catch((err) => {
      console.log(err.message);
      return email = null;
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
    .query(`SELECT id FROM users WHERE id = $1;`, [id])
    .then((result) => {
      console.log(result.rows);
      return Promise.resolve(result.rows[0]);
    })
    .catch((err) => {
      console.log(err.message);
      return id = null;
    });
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool
    .query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`, [user.name, user.email, user.password])
    .then((result) => {
      console.log(result.rows);
      return Promise.resolve(result.rows[0]);
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query(`
    SELECT reservations.*, properties.*, AVG(property_reviews.rating) AS average_rating
    FROM reservations
    JOIN properties ON properties.id = reservations.property_id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1 AND end_date < now()::date
    GROUP BY properties.id, reservations.start_date, reservations.end_date, reservations.id
    ORDER BY start_date
    LIMIT $2;`, [guest_id, limit])
    .then((result) => {
      //console.log(result.rows);
      return Promise.resolve(result.rows);
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */


const getAllProperties = (options, limit = 10) => {
  const queryParams = [];

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  JOIN users ON users.id = properties.owner_id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    if (queryParams.length >= 2) {
      queryString += `AND properties.owner_id = $${queryParams.length} `;
    } else {
      queryString += `WHERE properties.owner_id = $${queryParams.length} `;
    }
  }

  if (options.minimum_price_per_night) {
    const price = options.minimum_price_per_night * 100;
    queryParams.push(`${price}`);
    if (queryParams.length >= 2) {
      queryString += `AND cost_per_night > $${queryParams.length} `;
    } else {
      queryString += `WHERE cost_per_night > $${queryParams.length} `;
    }
  }

  if (options.maximum_price_per_night) {
    const price = options.maximum_price_per_night * 100;
    queryParams.push(`${price}`);
    if (queryParams.length >= 2) {
      queryString += `AND cost_per_night < $${queryParams.length} `;
    } else {
      queryString += `WHERE cost_per_night < $${queryParams.length} `;
    }
  }

  let rating = '';

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    rating += `HAVING AVG(property_reviews.rating) > $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ${rating}
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString, queryParams);

  return pool
    .query(queryString, queryParams)
    .then((result) => {
      //console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  console.log("property: ", property);
  const price = property.cost_per_night * 100;

  let queryParams = [];
  let items = '';
  let values = '';

  queryParams.push(`${property.title}`);
  items += 'title, ';
  values += `$${queryParams.length}, `;

  queryParams.push(`${property.description}`);
  items += 'description, ';
  values += `$${queryParams.length}, `;

  queryParams.push(`${property.number_of_bedrooms}`);
  items += 'number_of_bedrooms, ';
  values += `$${queryParams.length}, `;

  queryParams.push(`${property.number_of_bathrooms}`);
  items += 'number_of_bathrooms, ';
  values += `$${queryParams.length}, `;

  queryParams.push(`${property.parking_spaces}`);
  items += 'parking_spaces, ';
  values += `$${queryParams.length}, `;

  queryParams.push(`${price}`);
  items += 'cost_per_night, ';
  values += `$${queryParams.length}, `;

  queryParams.push(`${property.thumbnail_photo_url}`);
  items += 'thumbnail_photo_url, ';
  values += `$${queryParams.length}, `;

  queryParams.push(`${property.cover_photo_url}`);
  items += 'cover_photo_url, ';
  values += `$${queryParams.length}, `;

  queryParams.push(`${property.street}`);
  items += 'street, ';
  values += `$${queryParams.length}, `;

  queryParams.push(`${property.country}`);
  items += 'country, ';
  values += `$${queryParams.length}, `;

  queryParams.push(`${property.city}`);
  items += 'city, ';
  values += `$${queryParams.length}, `;

  queryParams.push(`${property.province}`);
  items += 'province, ';
  values += `$${queryParams.length}, `;

  queryParams.push(`${property.post_code}`);
  items += 'post_code, ';
  values += `$${queryParams.length}, `;

  queryParams.push(`${property.owner_id}`);
  items += 'owner_id';
  values += `$${queryParams.length}`;

  let queryString = `INSERT INTO properties (${items}) VALUES (${values}) RETURNING *;`;

  console.log(queryString, queryParams);

  return pool
    .query(queryString, queryParams)
    .then((result) => {
      console.log(result.rows);
      return Promise.resolve(result.rows);
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addProperty = addProperty;
