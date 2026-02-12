import { useEffect, useState } from "react";
import { localizeTime, tryParseJSON } from "../utils/common";
import Link from "next/link";
import DetailRow from "./DetailRow";
import SkeletonDetails from "./SkeletonDetails";
import { SKELETON_ROWS_COUNT } from "utils/constants";


type SpanDetailsProps = {
    spanId: string;
};

const SPANDETAILS_LABELS = {
    DATE: "Date",
    USER_ID: "User Id",
    SEGMENT_ID: "Segment Id",
    SESSION_ID: "Session Id",
    SERVICE_NAME: "Service",
    PAYLOAD: "Payload",
    HTTP_DB_INFO: "More Info",
};

const SpanDetails = ({ spanId }: SpanDetailsProps) => {
    const [spanInfo, setSpanInfo] = useState<any>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/spans/${spanId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const { data } = await response.json();
                setSpanInfo(data);
            } catch (error) {
                console.error("Error fetching span details:", error);
            } finally {
                setTimeout(() => setLoading(false), 200);
            }
        };
        fetchDetails();
    }, [spanId]);

    // Extract HTTP or DB specific fields
    const httpDbInfo: any = (() => {
        const additionalData = spanInfo?.data ?? {};
        if (additionalData["db.system"]) {
            return {
                Name: additionalData["db.name"],
                Operation: additionalData["db.operation"],
                Statement: additionalData["db.statement"],
            };
        } else if (additionalData["http.method"]) {
            return {
                Method: additionalData["http.method"],
                URL: additionalData["http.url"],
                Status: additionalData["http.status_code"],
                "User Agent": additionalData["http.user_agent"],
            };
        } else {
            return null;
        }
    })();

    const allDetails = [
        { label: SPANDETAILS_LABELS.USER_ID, value: spanInfo?.userId ?? "" },
        {
            label: SPANDETAILS_LABELS.SEGMENT_ID,
            value: spanInfo?.segmentId ?? "",
            isLink: true,
            link: `http://localhost:3000/segments/${spanInfo?.segmentId ?? ""}`,
        },
        {
            label: SPANDETAILS_LABELS.SESSION_ID,
            value: spanInfo?.sessionId ?? "",
            isLink: true,
            link: `http://localhost:3000/sessions/${spanInfo?.sessionId ?? ""}`,
        },
        {
            label: SPANDETAILS_LABELS.DATE,
            value: localizeTime(spanInfo?.sentAt / 1000),
        },
        {
            label: SPANDETAILS_LABELS.SERVICE_NAME,
            value: spanInfo?.data?.["service.name"] ?? "",
        },
        {
            label: SPANDETAILS_LABELS.PAYLOAD,
            value: JSON.stringify(tryParseJSON(spanInfo?.requestData ?? "")),
            section: "Data",
        },
    ];

    if (httpDbInfo) {
        allDetails.push({
            label: SPANDETAILS_LABELS.HTTP_DB_INFO,
            value: Object.keys(httpDbInfo || {}).map((key) => (
                <div key={key}>
                    <span>{key}</span>: {JSON.stringify(httpDbInfo[key])}
                </div>
            )),
        });
    }

    return (
        <div className="bg-white w-full shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Span Details
                </h3>
                <p className="mt-1 max-w-2xl text-xs text-gray-500">
                    {!loading && (spanInfo?.spanId ?? "N/A")}
                </p>
            </div>

            <div className="w-full px-4 py-5 sm:p-0">
                {loading ? (
                    <SkeletonDetails rows={SKELETON_ROWS_COUNT}  />
                ) : (
                    <dl>
                        {allDetails.map(({ label, value, section, isLink, link }, idx) => (
                            <div key={`${idx}-section`}>
                                {section && (
                                    <dt className="py-2 border-t border-gray-200 sm:py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <div className="text-md font-medium text-gray-700">
                                            {section}
                                        </div>
                                    </dt>
                                )}
                                {isLink ? (
                                    <DetailRow
                                        label={label}
                                        value={
                                            <span className="hover:font-bold">
                                                <Link href={link}>{value}</Link>
                                            </span>
                                        }
                                    />
                                ) : (
                                    <DetailRow label={label} value={value} />
                                )}
                            </div>
                        ))}
                    </dl>
                )}
            </div>
        </div>
    );
};

export default SpanDetails;
