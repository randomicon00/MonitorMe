package config

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
)

// Config struct maps to the JSON configuration
type Config struct {
	ServiceName string `json:"serviceName"`
	DBOptions   struct {
		MongoDB bool `json:"mongodb"`
		Redis   bool `json:"redis"`
	} `json:"dbOptions"`
	Endpoint string `json:"endpoint"`
}

// LoadConfig reads and parses the configuration from the provided file path
func LoadConfig(filePath string) (*Config, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("could not open config file: %w", err)
	}
	defer file.Close()

	bytes, err := ioutil.ReadAll(file)
	if err != nil {
		return nil, fmt.Errorf("could not read config file: %w", err)
	}

	var config Config
	if err := json.Unmarshal(bytes, &config); err != nil {
		return nil, fmt.Errorf("could not parse config file: %w", err)
	}

	return &config, nil
}
