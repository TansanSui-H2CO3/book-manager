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

### `spoiler`
| id | isbn | spoiled_date | user_name | spoiler | evaluation | up_vote | down_vote | visible |
|----|----|----|----|----|----|----|----|----|

```sql
create table book_manager.spoiler (
    id int,
    isbn varchar(13),
    spoiled_date date,
    user_name varchar(50),
    spoiler varchar(500),
    evaluation int,
    up_vote int,
    down_vote int,
    visible boolean
);
```

### `user`
| user_name | email | password | twitter_id | profiel | administrator |
|----|----|----|----|----|----|

```sql
create table book_manager.user (
    user_name varchar(50),
    email varchar(256),
    password varchar(256),
    twitter_id varchar(15),
    profiel varchar(140),
    administrator boolean
);
```

## References
### APIs
- [openBD](https://openbd.jp/)
- [楽天ブックス書籍検索API (version:2017-04-04)](https://webservice.rakuten.co.jp/api/booksbooksearch/)

### Web sites
- [書籍検索APIのリクエストパラメータ・取得値考察](https://qiita.com/kanary/items/5ec45bbc01efd4388fdb)