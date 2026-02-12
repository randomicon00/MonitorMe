import { useEffect, useState } from "react";
import { localizeTime } from "utils/common";
import Link from "next/link";
import DetailRow from "./DetailRow";
import SkeletonDetails from "./SkeletonDetails";
import { MIN_TIMEOUT, SKELETON_ROWS_COUNT } from "utils/constants";

type EventDetailsProps = {
    eventId: string;
};

const EVENTDETAILS_LABELS = {
    DATE: "Date",
    USER_ID: "User Id",
    SEGMENT_ID: "Segment Id",
    SESSION_ID: "Session Id",
    DATA: "Data",
};

const EventDetails = ({ eventId }: EventDetailsProps) => {
    const [eventInfo, setEventInfo] = useState<any>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/events/${eventId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const { data } = await response.json();
                setEventInfo(data);
            } catch (error) {
                console.error("Error fetching event details:", error);
            } finally {
                setTimeout(() => setLoading(false), MIN_TIMEOUT);
            }
        };
        fetchDetails();
    }, [eventId]);

    const allDetails = [
        { label: EVENTDETAILS_LABELS.USER_ID, value: eventInfo?.userId ?? "" },
        {
            label: EVENTDETAILS_LABELS.SEGMENT_ID,
            value: (
                <span>
                    <Link
                        href={`http://localhost:3000/segments/${eventInfo?.segmentId ?? ""
                            }`}
                        className="text-blue-500 hover:underline"
                    >
                        {eventInfo?.segmentId ?? ""}
                    </Link>{" "}
                </span>
            ),
        },
        {
            label: EVENTDETAILS_LABELS.SESSION_ID,
            value: (
                <span>
                    <Link
                        href={`http://localhost:3000/sessions/${eventInfo?.sessionId ?? ""
                            }`}
                        className="text-blue-500 hover:underline"
                    >
                        {eventInfo?.sessionId ?? ""}
                    </Link>
                </span>
            ),
        },
        {
            label: EVENTDETAILS_LABELS.DATE,
            value: localizeTime(eventInfo?.data?.timestamp),
        },
        {
            label: EVENTDETAILS_LABELS.DATA,
            value: Object.keys(eventInfo?.data?.data || {}).map((key) => (
                <div key={key}>
                    <span>{key}</span>: {JSON.stringify(eventInfo.data.data[key])}
                </div>
            )),
            section: "Data",
        },
    ];

    return (
        <div className="bg-white w-full shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Event Details
                </h3>
                <p className="mt-1 max-w-2xl text-xs text-gray-500">
                    {!loading && (eventInfo?.id ?? "N/A")}
                </p>
            </div>

            <div className="w-full px-4 py-5 sm:p-0">
                {loading ? (
                    <SkeletonDetails rows={SKELETON_ROWS_COUNT} />
                ) : (
                    <dl>
                        {allDetails.map(({ label, value, section }, idx) => (
                            <div key={`${idx}-section`}>
                                {section && (
                                    <dt className="py-2 border-t border-gray-200 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <div className="text-md font-medium text-gray-700">
                                            {section}
                                        </div>
                                    </dt>
                                )}
                                <DetailRow label={label} value={value} />
                            </div>
                        ))}
                    </dl>
                )}
            </div>
        </div>
    );
};

export default EventDetails;
