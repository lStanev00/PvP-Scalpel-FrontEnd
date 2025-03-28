import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import getFingerprint from "../helpers/getFingerprint.js";
import httpFetch from "../helpers/httpFetch.js";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [fetchData, setFetchData] = useState(undefined);

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const validationApiEndpoint = '/validate/email';
        const result = {};

        const req = await httpFetch(validationApiEndpoint, {
          method: "POST",
          body: JSON.stringify({ token: token, fingerprint :getFingerprint() })
        });

        result.req = req;

        if (!req.ok) {
          setFetchData(result);
          return;
        }

        const data = await req.json();
        result.data = data;

        setFetchData(result);
        
        // OPTIONAL: auto-redirect after successful verification
        navigate("/"); 
      } catch (error) {
        setFetchData(undefined);
      }
    };

    if (token) {
      makeRequest();
    }
  }, [token]);

  return (
    <>
      <div>
        {fetchData === undefined && <p>🔄 Verifying token...</p>}
        {fetchData?.req?.ok === false && <p>❌ Invalid or expired verification link.</p>}
        {fetchData?.data && <p>✅ Email verified successfully! Validating please wait.</p>}
      </div>
    </>
  );
}
