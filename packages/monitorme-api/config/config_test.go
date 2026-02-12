package config_test

import (
	"os"
	"testing"
	"time"

	"monitorme/config"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func setEnvs() {
	os.Setenv("DBHOST", "localhost")
	os.Setenv("PORT", "3306")
	os.Setenv("TIMEZONE", "UTC")
	os.Setenv("DBNAME", "testdb")
	os.Setenv("DBUSER", "test")
	os.Setenv("DBPASSWORD", "123456")
	os.Setenv("DBMAXIDLECONNS", "10")
	os.Setenv("DBMAXOPENCONNS", "20")
	os.Setenv("DBCONNMAXLIFETIME", "30m")
	os.Setenv("DBLOGLEVEL", "1")
}

func setup() {
	setEnvs()

	config.Config()
}

func TestMain(t *testing.M) {
	setup()
	code := t.Run()
	os.Exit(code)
}

func TestSomething(t *testing.T) {
	assert := assert.New(t)

	var a string = "Hello1"
	var b string = "Hello1"

	assert.Equal(a, b, "The two words should be the same.")
}

func TestDatabaseConfig(t *testing.T) {
	assert := assert.New(t)

	// this is for env
	//cwd, _ := os.Getwd()
	dbConfig, err := config.Database()
	require.NoError(t, err)

	// assert results
	assert.Equal("localhost", dbConfig.Host, "Host value should be localhost")
	assert.Equal("3306", dbConfig.Port, "Port value should be 3306")
	assert.Equal("UTC", dbConfig.TimeZone, "TimeZone value should be UTC")
	assert.Equal("testdb", dbConfig.DbName, "DbName value should be testdb")
	assert.Equal("test", dbConfig.User, "User value should be test")
	assert.Equal("123456", dbConfig.Pass, "Pass value should be 123456")
	assert.Equal(10, dbConfig.MaxIdleConns, "MaxIdleConns value should be 10")
	assert.Equal(20, dbConfig.MaxOpenConns, "MaxOpenConns value should be 20")
	assert.Equal(30*time.Minute, dbConfig.ConnMaxLifetime, "ConnMaxLifetime value should be 30 minutes")
	assert.Equal(1, dbConfig.LogLevel, "LogLevel value should be 1")
}

func TestConfig(t *testing.T) {
	assert := assert.New(t)

	// call general config
	config := config.GetConfig()
	dbConfig := config.Database

	// assert results
	assert.Equal("localhost", dbConfig.Host, "Host value should be localhost")
	assert.Equal("3306", dbConfig.Port, "Port value should be 3306")
	assert.Equal("UTC", dbConfig.TimeZone, "TimeZone value should be UTC")
	assert.Equal("testdb", dbConfig.DbName, "DbName value should be testdb")
	assert.Equal("test", dbConfig.User, "User value should be test")
	assert.Equal("123456", dbConfig.Pass, "Pass value should be 123456")
	assert.Equal(10, dbConfig.MaxIdleConns, "MaxIdleConns value should be 10")
	assert.Equal(20, dbConfig.MaxOpenConns, "MaxOpenConns value should be 20")
	assert.Equal(30*time.Minute, dbConfig.ConnMaxLifetime, "ConnMaxLifetime value should be 30 minutes")
	assert.Equal(1, dbConfig.LogLevel, "LogLevel value should be 1")
}
