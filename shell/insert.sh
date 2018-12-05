
today=$(date -d'10 minute ago' +'%Y-%m-%d')
time=$(date -d'10 minute ago' +'%H-%M')

mysql -uroot -pcclab1217 KOREN -e "insert into DATA_JNU(OBOX,CCTV,DATE,TIME,STORAGE,PATH) VALUES('JNU','vid1',NOW(),NOW(),'/home/ubuntu/JNU/jnu_camera1/$today/','/home/ubuntu/JNU/jnu_camera1/$today/$time.mp4');"
mysql -uroot -pcclab1217 KOREN -e "insert into DATA_JNU(OBOX,CCTV,DATE,TIME,STORAGE,PATH) VALUES('JNU','vid2',NOW(),NOW(),'/home/ubuntu/JNU/jnu_camera2/$today/','/home/ubuntu/JNU/jnu_camera2/$today/$time.mp4');"
mysql -uroot -pcclab1217 KOREN -e "insert into DATA_JNU(OBOX,CCTV,DATE,TIME,STORAGE,PATH) VALUES('CHULA','vid1',NOW(),NOW(),'/home/ubuntu/CHULA/chula_camera1/$today/','/home/ubuntu/CHULA/chula_camera1/$today/$time.mp4');"
mysql -uroot -pcclab1217 KOREN -e "insert into DATA_JNU(OBOX,CCTV,DATE,TIME,STORAGE,PATH) VALUES('UCI','vid1',NOW(),NOW(),'/home/ubuntu/UCI/uci_camera1/$today/','/home/ubuntu/UCI/uci_camera1/$today/$time.mp4');"
