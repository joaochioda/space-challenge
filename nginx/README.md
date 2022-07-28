https://www.youtube.com/watch?v=sdAB93h4S1w

cd nginx-1.22.0

`.\nginx.exe -t`

`start .\nginx.exe`

`nginx-1.22.0/conf/nginx.conf`

 server {
       listen       81;
       server_name  somename  alias  another.alias;

       location / {
           proxy_pass   http://localhost:3333;
       }
    }

*ssl

`openssl req -x509 -newkey rsa:4096 -keyout domain.key -out domain.csr -sha256 -days 365 -subj '/CN=localhost'`

** working
`openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout example.key -out example.crt `

* ssl

server {
       listen 443 ssl;
       server_name  localhost;

        ssl_certificate ../ssl/example.crt;
        ssl_certificate_key ../ssl/example.key;

        location / {
            proxy_pass   http://localhost:3333;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }