const books = require('./books');
const { nanoid } = require('nanoid');

const addBookHandler = (request, h) => {

    // {
    //     "id": "Qbax5Oy7L8WKf74l",
    //     "name": "Buku A",
    //     "year": 2010,
    //     "author": "John Doe",
    //     "summary": "Lorem ipsum dolor sit amet",
    //     "publisher": "Dicoding Indonesia",
    //     "pageCount": 100,
    //     "readPage": 25,
    //     "finished": false,
    //     "reading": false,
    //     "insertedAt": "2021-03-04T09:11:44.598Z",
    //     "updatedAt": "2021-03-04T09:11:44.598Z"
    // }
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    if(readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    if(name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const finished = pageCount === readPage;
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

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

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
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = (request, h) => {
    let filteredBooks = books;
    const { name, reading, finished } = request.query;

    if (name) {
        filteredBooks = filteredBooks.filter((b) => b.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (reading !== undefined) {
        filteredBooks = filteredBooks.filter((b) => b.reading === (reading === '1'));
    }
    if (finished !== undefined) {
        filteredBooks = filteredBooks.filter((b) => b.finished === (finished === '1'));
    }

    // only return id, name, and publisher
    filteredBooks = filteredBooks.map((b) => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher,
    }));
    return {      
        status: 'success',
        data: {
            books: filteredBooks,
        },
    };
};

const getBookByIdHandler = (request, h) => {
    const {
        id
    } = request.params;

    const book = books.filter((n) => n.id === id)[0];


    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
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

    // request body:
    // {
    //     "name": string,
    //     "year": number,
    //     "author": string,
    //     "summary": string,
    //     "publisher": string,
    //     "pageCount": number,
    //     "readPage": number,
    //     "reading": boolean
    // }
    const {
        id
    } = request.params;

    if(id === undefined) {
        
    }

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    if(name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if(readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
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
    const {
        id
    } = request.params;

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
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