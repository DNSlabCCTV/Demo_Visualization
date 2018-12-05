DEFAULT='/home/ubuntu/SKKU/'$1'/'$2

while read line
do
	m_path=$DEFAULT'/'$line
	#echo $m_path

	# $1 = OBOX, $2 = CCTV, $3 = ( include path, filename )
	mysql -uroot -pcclab1217 KOREN -e "insert into DATA_SKKU(OBOX,CCTV,PATH) VALUES('$1','$2','$m_path');"

done < $3

