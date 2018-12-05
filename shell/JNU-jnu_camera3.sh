today=$(date +'%Y-%m-%d')
time=$(date +'%H-%M')

sleep 3
cvlc -vvv http://210.114.90.86:18901/zm/cgi-bin/nph-zms?monitor=1 --sout=#transcode{acodec=none}:file{dst=/home/ubuntu/JNU/jnu_camera3/$today/$time.mp4}
