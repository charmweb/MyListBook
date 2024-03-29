// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}


// UI Class: Handle Ui Task == eg Alert messages, Display List

class UI {
    static displayBooks(){
        // const StoredBooks = [
        //     {
        //         title: 'Book One',
        //         author: 'John Doe',
        //         isbn: '3434434'
        //     },
        //     {
        //         title: 'Book Two',
        //         author: 'Jane Doe',
        //         isbn: '45545'
        //     }
        // ];
 
        const books = Store.getBooks(); 
        // console.log(books);
        // getBooks method
        books.forEach((book) => UI.addBookToList(book));
// or   Array.prototype.forEach.call(books,(book) => UI.addBookToList(book));

    }
    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }

    static deleteBook(el){
        if(el.classList.contains('delete')){
            // console.log(el.parentElement.previousElementSibling.textContent); 
            // console.log(el.parentElement.parentElement); tr
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className} text-center font-weight-bold`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        // Vanish in 3 seconds
         setTimeout(() => document.querySelector('.alert').remove(), 1500);
    }

    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store Class: Handles Storage, 
    // Local Storage within a browser
    // It does not go away, when you refresh the site,
    // Or close the browser; it stays there until 
    // it's cleared

class Store {

    // methods static to be able to call them directly without having to 
    // instantiate the Store class
    static getBooks(){
// Local storage stores arrays not objects, 'key value pairs'
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
            //item books is gonna be stored like a string
            //json.parse enables us to use it as a JS array of objects
        }
        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
       const books = Store.getBooks();
       books.forEach((book, index) => {
           // We have to check if the ISBN matches the book that is passed
           // for removal
           if(book.isbn === isbn){
               books.splice(index, 1);
           }
       });
       localStorage.setItem('books', JSON.stringify(books));
    }
}



// Event: Display Books

document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book

document.querySelector('#book-form').addEventListener('submit', (e) =>
{
    // Prevent actual submit
    e.preventDefault();
 
    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if(title === '' || author === '' || isbn ===''){
        // alert('Please fill all fields');
        UI.showAlert('Please fill all the fields', 'danger');
    } else {
        // Instatiate book
        const book = new Book(title, author, isbn);
        // console.log(book);

        // Add Book to UI
        UI.addBookToList(book);
        
        // Add book to Store
        Store.addBook(book);  

        // Show success message
        UI.showAlert(`The book "${book.title}" has been added`, 'success');

        // CLEAR FIELDS
        UI.clearFields();
    }
});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    // console.log(e.target.parentElement.previousElementSibling.textContent); => isbn

    //Remove Book from UI
    UI.deleteBook(e.target);
    // Show success message
    const bookname = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    UI.showAlert(`The book "${bookname}"  has been removed`, 'success');
    // Remove Book from storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    
});