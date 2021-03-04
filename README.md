# book-manager
Manage read books.

## Database structure
### `book_list`
| isbn | title | author | publisher | pubsication_date | page_number | price | tag | link |
|----|----|----|----|----|----|----|----|----|

### `read_book_list`
| isbn | date | impression |
|----|----|----|

### `review`
| isbn | date | user_name | comment | evaluation |
|----|----|----|----|----|