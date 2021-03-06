# book-manager
Manage read books.

## Database structure
Since the fundamental information of books is obtained from open source, you prepare database about your impressions and reviews.

### `book` 
|isbn|dokuryo|read_date|impression|
|----|----|----|----|

```sql
create table book_manager.book (
    isbn varchar(13),
    dokuryo boolean,
    read_date date,
    impression varchar(500)
);
```

### `review`
| isbn | date | user_name | comment | evaluation |
|----|----|----|----|----|

## References
### APIs
- [openBD](https://openbd.jp/)

### Web sites
- [���Ќ���API�̃��N�G�X�g�p�����[�^�E�擾�l�l�@](https://qiita.com/kanary/items/5ec45bbc01efd4388fdb)