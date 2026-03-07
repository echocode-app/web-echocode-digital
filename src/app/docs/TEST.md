
--- 

git checkout BE
git rebase develop

--- 

rm -rf .next

npm run check

--- 

curl -i -X POST http://localhost:3000/api/forms/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "formType":"project",
    "firstName":"Anna",
    "lastName":"Kotlyar",
    "email":"anna@example.com",
    "needs":"Need a backend MVP estimation for a new product."
  }'

# 200
response shape:
success: true
data.id (string)
data.status === "new"
data.createdAt (ISO string)
є x-request-id header

--- 

curl -i -X POST http://localhost:3000/api/forms/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "formType":"project",
    "firstName":"Anna",
    "lastName":"Kotlyar",
    "email":"anna@example.com",
    "needs":"Need a backend MVP estimation for a new product.",
    "attachment":{
      "path":"uploads/submissions/tmp/test.pdf",
      "originalName":"test.pdf",
      "mimeType":"application/pdf",
      "sizeBytes":1234
    }
  }'

# 400
success: false
error.code === "ATTACHMENT_NOT_SUPPORTED_YET"

--- 

curl -i -X POST http://localhost:3000/api/forms/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "formType":"candidate",
    "profileUrl":"https://linkedin.com/in/test",
    "cvFile":{
      "path":"uploads/submissions/tmp/cv.pdf",
      "originalName":"cv.pdf",
      "mimeType":"application/pdf",
      "sizeBytes":1234
    }
  }'

# 501
success: false
error.code === "NOT_IMPLEMENTED"

--- 

STORAGE

curl -i -X POST http://localhost:3000/api/forms/uploads/init \
  -H "Content-Type: application/json" \
  -d '{
    "formType":"project",
    "file":{
      "originalName":"brief.pdf",
      "mimeType":"application/pdf",
      "sizeBytes":123456
    }
  }'

# 200
uploadUrl існує
path виглядає як:
uploads/submissions/tmp/<uuid>
expiresAt ≈ now + 10 min
в response немає нічого зайвого
у логах немає signed URL

---

curl -i -X PUT "<signedUrl>" \
  -H "Content-Type: application/pdf" \
  --data-binary @test.pdf

# 200 / 201
файл реально зʼявився в Firebase Storage
path співпадає
Перевір в Storage Console

---

curl -i -X POST http://localhost:3000/api/forms/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "formType":"project",
    "firstName":"Anna",
    "lastName":"Kotlyar",
    "email":"anna@example.com",
    "needs":"Need a backend MVP estimation for a new product.",
    "attachment":{
      "path":"uploads/submissions/tmp/UUID_FROM_INIT",
      "originalName":"brief.pdf",
      "mimeType":"application/pdf",
      "sizeBytes":123456
    }
  }'

# 200
Firestore документ містить attachment
attachments.length === 1
metadata збігається
createdAt ISO
немає undefined
