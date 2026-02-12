package middleware

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
)

type JWTConfiguration struct {
	AccessKey  []byte
	AccessTTL  int
	RefreshKey []byte
	RefreshTTL int

	Audience string
	Issuer   string
	AccNbf   int
	RefNbf   int
	Subject  string
}

var JWTConfig JWTConfiguration

type MyClaims struct {
	UserID uint64 `json:"userID,omitempty"`
	Email  string `json:"email,omitempty"`
}

type JWTClaims struct {
	MyClaims
	jwt.RegisteredClaims
}

type JWTPayload struct {
	AccessJWT  string `json:"accessJWT,omitempty"`
	RefreshJWT string `json:"refreshJWT,omitempty"`
}

func ValidateAccessJWTToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" || !strings.HasPrefix(tokenString, "Bearer ") {
			fmt.Println("Validation failed: Missing or malformed Authorization header.")
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		tokenStrings := strings.Split(tokenString, " ")
		if len(tokenStrings) != 2 {
			fmt.Println("Validation failed: Authorization header does not contain a Bearer token.")
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		parsedToken, err := jwt.ParseWithClaims(tokenStrings[1], &JWTClaims{}, validateHMACMethodAndReturnAccessKey)
		if err != nil {
			fmt.Printf("Validation failed: Error parsing token - %v\n", err)
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		if claims, ok := parsedToken.Claims.(*JWTClaims); ok && parsedToken.Valid {
			fmt.Printf("Validation succeeded: Token valid for userID %d and email %s\n", claims.UserID, claims.Email)
			c.Set("userID", claims.UserID)
			c.Set("email", claims.Email)
		} else {
			fmt.Println("Validation failed: Token is invalid or claims could not be parsed.")
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		fmt.Printf("Proceeding to the next handler with valid access token")
		c.Next()
	}
}

func validateHMACMethodAndReturnAccessKey(token *jwt.Token) (interface{}, error) {
	if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
		return nil, fmt.Errorf("wrong signing method: %v", token.Header["alg"])
	}
	return JWTConfig.AccessKey, nil
}

func ValidateAndGetRefreshJWTToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" || !strings.HasPrefix(tokenString, "Bearer ") {
			fmt.Println("Validation failed: Missing or malformed Authorization header for refresh token.")
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		tokenStrings := strings.Split(tokenString, " ")
		if len(tokenStrings) != 2 {
			fmt.Println("Validation failed: Authorization header does not contain a Bearer token for refresh.")
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		parsedToken, err := jwt.ParseWithClaims(tokenStrings[1], &JWTClaims{}, validateHMACMethodAndReturnRefreshKey)
		if err != nil {
			fmt.Printf("Validation failed: Error parsing refresh token '%s' - %v\n", tokenStrings[1], err)
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		if claims, ok := parsedToken.Claims.(*JWTClaims); ok && parsedToken.Valid {
			fmt.Printf("Validation succeeded: Refresh token valid for userID %d and email %s\n", claims.UserID, claims.Email)
			c.Set("userID", claims.UserID)
			c.Set("email", claims.Email)
		} else {
			fmt.Println("Validation failed: Refresh token is invalid or claims could not be parsed.")
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		fmt.Println("Proceeding to the next handler with valid refresh token.")
		c.Next()
	}
}

func validateHMACMethodAndReturnRefreshKey(token *jwt.Token) (interface{}, error) {
	if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
		return nil, fmt.Errorf("wrong signing method: %v", token.Header["alg"])
	}
	return JWTConfig.RefreshKey, nil
}

func validateJWT(token *jwt.Token, tokenKind string) (interface{}, error) {
	if tokenKind == "access" {
		return nil, fmt.Errorf("unimplemented")
	} else if tokenKind == "refresh" {
		return nil, fmt.Errorf("unimplemented")
	}

	return nil, fmt.Errorf("wrong access type")
}

func GenerateJWT(myClaims MyClaims, tokenKind string) (string, error) {
	var key []byte
	var ttl, nbfOffset int

	if tokenKind == "access" {
		key = JWTConfig.AccessKey
		ttl = JWTConfig.AccessTTL
		nbfOffset = JWTConfig.AccNbf
	} else if tokenKind == "refresh" {
		key = JWTConfig.RefreshKey
		ttl = JWTConfig.RefreshTTL
		nbfOffset = JWTConfig.RefNbf
	} else {
		return "", fmt.Errorf("invalid token kind: %s", tokenKind)
	}


    // Calculate 12 years in minutes.
    const days = 700
    // Multiply ttl (the base multiplier) by minutes per year and by 2 for 2 years.
    expirationDuration := time.Minute * time.Duration(ttl *  2 * days)

	claims := JWTClaims{
		MyClaims{
			UserID: myClaims.UserID,
			Email:  myClaims.Email,
		},
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expirationDuration)),
			NotBefore: jwt.NewNumericDate(time.Now().Add(time.Second * time.Duration(nbfOffset))), // Set NotBefore claim
			ID:        uuid.NewString(),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    JWTConfig.Issuer,
			Subject:   JWTConfig.Subject,
		},
	}

	generatedToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	jwtToken, err := generatedToken.SignedString(key)
	if err != nil {
		return "", err
	}

	return jwtToken, nil
}
