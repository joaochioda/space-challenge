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

https://189.46.42.93/ - ssl
http://189.46.42.93:82/ - http