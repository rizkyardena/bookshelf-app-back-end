const {nanoid} = require('nanoid');
const booksArray = require('./books');

const addBookHandler = (request, h) => {
  const {name, year, author, summary, publisher,
    pageCount, readPage, reading} = request.payload;
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      // eslint-disable-next-line max-len
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  booksArray.push(newBook);

  const isSuccess = booksArray.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  };

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
    data: {
      noteId: id,
    },
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const {reading, finished, name} = request.query;
  let books = booksArray;
  if (reading !== undefined) {
    books = books.filter((b) => b.reading == reading);
  }
  if (finished !== undefined) {
    books = books.filter((b) => b.finished == finished);
  }
  if (name !== undefined) {
    // eslint-disable-next-line max-len
    books = books.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()));
  }
  // eslint-disable-next-line max-len
  books = books.map(({id, name, publisher}) => ({id, name, publisher}));
  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const {id} = request.params;

  const book = booksArray.filter((b) => b.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {book},
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const {name, year, author, summary, publisher,
    pageCount, readPage, reading} = request.payload;

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  if (!name || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      // eslint-disable-next-line max-len
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = booksArray.findIndex((b) => b.id === id);
  if (index !== -1) {
    booksArray[index] = {
      ...booksArray[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const index = booksArray.findIndex((b) => b.id === id);

  if (index !== -1) {
    booksArray.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
