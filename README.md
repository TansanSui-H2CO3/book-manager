# book-manager
Manage read books.

## Database structure
### `book_list`
| isbn | title | author | publisher | pubsication_date | page_number | tag | link |
|----|----|----|----|----|----|----|----|

### `read_book`
| isbn | date | impression |
|----|----|----|

### `review`
| isbn | date | user_name | comment | evaluation |
|----|----|----|----|----|