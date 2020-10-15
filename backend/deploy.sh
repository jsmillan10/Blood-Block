aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 239608887470.dkr.ecr.us-east-1.amazonaws.com

cd ./dist/modules/auth
docker build -t 2match-auth .
docker tag 2match-auth:latest 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-auth:latest
docker push 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-auth:latest

cd ../companies
docker build -t 2match-companies .
docker tag 2match-companies:latest 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-companies:latest
docker push 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-companies:latest

cd ../history
docker build -t 2match-history .
docker tag 2match-history:latest 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-history:latest
docker push 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-history:latest

cd ../invoices
docker build -t 2match-invoices .
docker tag 2match-invoices:latest 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-invoices:latest
docker push 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-invoices:latest

cd ../offers
docker build -t 2match-offers .
docker tag 2match-offers:latest 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-offers:latest
docker push 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-offers:latest

cd ../offersBags
docker build -t 2match-offersbags .
docker tag 2match-offersbags:latest 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-offersbags:latest
docker push 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-offersbags:latest

cd ../tradingBags
docker build -t 2match-tradingbags .
docker tag 2match-tradingbags:latest 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-tradingbags:latest
docker push 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-tradingbags:latest

cd ../emails
docker build -t 2match-emails .
docker tag 2match-emails:latest 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-emails:latest
docker push 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-emails:latest

cd ../dailyEmails
docker build -t 2match-daily-emails .
docker tag 2match-daily-emails:latest 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-daily-emails:latest
docker push 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-daily-emails:latest

cd ../expirationVerifier
docker build -t 2match-expiration-verifier .
docker tag 2match-expiration-verifier:latest 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-expiration-verifier:latest
docker push 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-expiration-verifier:latest

cd ../SFTPInvoices
docker build -t 2match-sftp-invoices .
docker tag 2match-sftp-invoices:latest 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-sftp-invoices:latest
docker push 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-sftp-invoices:latest

cd ../../../bestOption
docker build -t 2match-bestoption .
docker tag 2match-bestoption:latest 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-bestoption:latest
docker push 239608887470.dkr.ecr.us-east-1.amazonaws.com/2match-bestoption:latest