path=/home/ubuntu/demo_visualization/shell

cp $path/s1.sh $path/$1-$2.sh

# start vlc + $1=OBOX $2=CCTV $3=url_port
echo "cvlc -vvv $3 --sout=#transcode{acodec=none}:file{dst=/home/ubuntu/$1/$2/""$""today/""$""time.mp4}" >> $path/$1-$2.sh
cat <(crontab -l) <(echo "*/10 * * * * $path/$1-$2.sh") | crontab -

sudo chmod 755 $path/$1-$2.sh

# DB query
mysql -uroot -pcclab1217 KOREN -e "insert into DATA_JNU(OBOX,CCTV,DATE,TIME,STORAGE,PATH) VALUES('$1','$2','$today','$time','/home/ubuntu/$1/$2/""$""today/','/home/ubuntu/$1/$2/""$""today/""$""time.mp4');"

echo "mkdir -p /home/ubuntu/$1/$2/""$""today" >> $path/f1.sh
echo "mkdir -p /home/ubuntu/SKKU/$1/$2/""$""today" >> $path/f1.sh

$path/f1.sh

