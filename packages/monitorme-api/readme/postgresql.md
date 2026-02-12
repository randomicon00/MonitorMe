# PostgreSQL Setup: Create Database and User with Necessary Permissions

This documentation provides a step-by-step guide to completely reset a PostgreSQL database and user, ensuring
all necessary privileges are granted. This approach is particularly useful in PostgreSQL 15+, where schema-level
permissions for table creation require explicit configuration.

## Steps

### Step 1: Drop the Database and User (if they exist)

Log in as a Superuser (usually postgres):

```bash
sudo -u postgres psql
```

Revoke All Privileges from the User:

```sql
REVOKE ALL PRIVILEGES ON DATABASE monitorme_service FROM test_user;
REVOKE ALL PRIVILEGES ON SCHEMA public FROM test_user;
```

Drop the Database and User:

```sql
DROP DATABASE IF EXISTS monitorme_service;
DROP USER IF EXISTS test_user;
```

### Step 2: Create the Database and User with Correct Privileges

Create the Database:

```sql
CREATE DATABASE monitorme_service;
Create the User:
```

```sql
CREATE USER test_user WITH ENCRYPTED PASSWORD 'test_pass';
```

Grant Database-Level Privileges:

Allow test_user to connect to and operate within the monitorme_service database.

```sql
GRANT CONNECT ON DATABASE monitorme_service TO test_user;
GRANT ALL PRIVILEGES ON DATABASE monitorme_service TO test_user;
```

### Step 3: Grant Schema-Level Privileges for PostgreSQL 15+

Switch to the New Database:

Connect to monitorme_service as the superuser (still in psql):

```sql
\c monitorme_service postgres
```

Grant Explicit Privileges on the public Schema:

Grant test_user the necessary privileges on the public schema to create and manage tables.

```sql
GRANT USAGE ON SCHEMA public TO test_user;
GRANT CREATE ON SCHEMA public TO test_user;
GRANT ALL ON SCHEMA public TO test_user;
```

Set Default Privileges on New Tables:

Configure default privileges so that test_user can create and modify tables by default in the public schema.

```sql
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO test_user;
```

#### Step 4: Verify Permissions

Reconnect as test_user:

Exit the superuser session with \q, then reconnect as test_user:

```bash
psql -h localhost -U test_user -d monitorme_service
```

Try Creating a Test Table:

Run the following to confirm that test_user can create tables in the public schema:

```sql
CREATE TABLE public.test_table (
    id SERIAL PRIMARY KEY,
    name TEXT
);
```

If the table creation succeeds, test_user should now have all necessary permissions to interact with the monitorme_service database, including creating and managing tables in the public schema.
