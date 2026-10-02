import os, json, urllib.request, urllib.error

base = os.environ["INTEGRATION_PROXY_URL"]
job_id = "c47fbef2-3032-457b-948b-d5a0471cdb41"
key = "sk-emergent-d5c1eFc5aB0891cCdC"
req = urllib.request.Request(
    base + "/stripe/sandboxes",
    data=json.dumps({"job_id": job_id}).encode(),
    headers={"Authorization": "Bearer " + key, "Content-Type": "application/json"},
    method="POST",
)
try:
    with urllib.request.urlopen(req) as r:
        sandbox = json.load(r)
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print("PROVISIONING FAILED", e.code, body)
    raise SystemExit(1)

print("SANDBOX_SECRET_KEY=" + sandbox["sandbox_secret_key"])
print("SANDBOX_PUBLISHABLE_KEY=" + sandbox["sandbox_publishable_key"])
print("SANDBOX_ACCOUNT_ID=" + sandbox["sandbox_account_id"])
print("PREVIEW_WEBHOOK_SECRET=" + sandbox.get("preview_webhook_secret", ""))
print("ONBOARDING_URL=" + sandbox.get("onboarding_url", ""))

# country check
import stripe
stripe.api_key = sandbox["sandbox_secret_key"]
acct = stripe.Account.retrieve()
print("COUNTRY=" + str(acct.get("country")))
