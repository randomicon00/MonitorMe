package controllers

import (
	"monitorme/database/model"
	"monitorme/lib/response"
	"monitorme/logic"

	"net/http"

	"github.com/gin-gonic/gin"
)

// GET spans
func GetSpans(c *gin.Context) {
	resp, statusCode := logic.GetAllSpans()

	response.JSON(c, statusCode, resp)
}

func GetSpanByID(c *gin.Context) {
	id := c.Param("id")

	resp, statusCode := logic.GetSpanByID(id)

	response.JSON(c, statusCode, resp)
}

// GET spansbytrace/:id
func GetSpansByTrace(c *gin.Context) {
	trace_id := c.Param("id")

	resp, statusCode := logic.GetSpansByTraceID(trace_id)

	response.JSON(c, statusCode, resp)
}

// GET spansbysegment/:id
func GetSpansBySegment(c *gin.Context) {
	segment_id := c.Param("id")

	resp, statusCode := logic.GetSpansBySegmentID(segment_id)

	response.JSON(c, statusCode, resp)
}

// GET spansbysesession/:id
func GetSpansBySession(c *gin.Context) {
	session_id := c.Param("id")

	resp, statusCode := logic.GetSpansBySessionID(session_id)

	response.JSON(c, statusCode, resp)
}

// POST spans/
func CreateSpans(c *gin.Context) {
	var zkSpans []*model.ZipkinSpan

	// Bind and validate the input
	if err := c.BindJSON(&zkSpans); err != nil {
		response.JSON(c, http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Delegate the logic to the logic package
	resp, statusCode := logic.CreateSpans(zkSpans)

	// Return the response
	response.JSON(c, statusCode, resp)
}

/*
func insert_spans(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Inserting a Span")
	// r.Body is type *http.bodyblob
	// io.ReadAll returns an array of bytes
	body, err := io.ReadAll(r.Body)
	if err != nil {
	  send_incorrect_params(w)
	  return
	} else if len(body) == 0 {
	  send_missing_body(w)
	  return
	}

	// format_spans takes an array of bytes
	// and returns an array of structs.CassandraSpan objects
	cspans := format_spans(body)

	for _, span := range(cspans) {
	  if span == nil { continue }
	  // json.Marshal returns the json encoding of the variable passed into it
	  j, _ := json.Marshal(span)

	  table := "spans"
	  if span.Session_id == "" { table = "db_span_buffer" }

	  // each json-ified span is stringified and inserted into the database as a json object
	  query := "INSERT INTO retrospect." + (table) + " JSON '" + string(j) + "';"
	  fmt.Println(query)
	  session.Query(query).Exec()
	}

	send_creation_success(w)
  }


  func format_spans(blob []byte) []*structs.CassandraSpan {
	// initializing an array of SpanStructInput objects
	fmt.Println(string(blob))
	var jspans []*structs.SpanStructInput
	json.Unmarshal(blob, &jspans)
	cspans := make([]*structs.CassandraSpan, len(jspans))
	fmt.Println("cspans len:", len(cspans))

	for _, e := range jspans {
		if e == nil {
			continue
		}
		if e.Tags["http.method"] == "OPTIONS" {
			continue
		}

		sc, _ := strconv.ParseInt(e.Tags["http.status_code"], 10, 64)
		rd := []byte(e.Tags["requestData"])

		// if it's a db span, add frontend session info
		_, is_db := e.Tags["db.system"]

		delete(e.Tags, "requestData")

		tags := "{}"
		if len(e.Tags) > 0 {
			tags = "{"
			for k, v := range e.Tags {
				tags += fmt.Sprintf(`"%s": "%s", `, k, v)
			}
			tags = tags[0:len(tags)-2] + "}"
		}
		blob, _ := json.Marshal(tags)

		if is_db {
			cspans = append(cspans, &structs.CassandraSpan{
				Trace_id:      e.Trace_id,
				Span_id:       e.Span_id,
				Time_sent:     e.Time_sent,
				Duration:      strconv.Itoa(e.Duration) + "us",
				Session_id:    "",
				User_id:       "",
				Chapter_id:    "",
				Trigger_route: "",
				Request_data:  rd,
				Status_code:   int16(sc),
				Data:          blob,
			})
		} else {
			cspans = append(cspans, &structs.CassandraSpan{
				Trace_id:      e.Trace_id,
				Span_id:       e.Span_id,
				Time_sent:     e.Time_sent,
				Duration:      strconv.Itoa(e.Duration) + "us",
				Session_id:    e.Tags["frontendSession"],
				User_id:       e.Tags["frontendUser"],
				Chapter_id:    e.Tags["frontendChapter"],
				Trigger_route: e.Tags["triggerRoute"],
				Request_data:  rd,
				Status_code:   int16(sc),
				Data:          blob,
			})
		}

	}
	return cspans
}
*/
