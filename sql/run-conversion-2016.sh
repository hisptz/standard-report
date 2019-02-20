#!/bin/sh
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -a -f src/sql/conversion2.0.sql &&
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Arusha')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Arusha')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Arusha')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Arusha')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Arusha')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Arusha')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Arusha')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Arusha')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Arusha')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Arusha')" &&
wait
echo all processes complete 1 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Arusha')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Arusha')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Dar es salaam')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Dar es salaam')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Dar es salaam')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Dar es salaam')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Dar es salaam')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Dar es salaam')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Dar es salaam')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Dar es salaam')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Dar es salaam')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Dar es salaam')" &&
wait
echo all processes complete 2 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Dar es salaam')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Dar es salaam')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Dodoma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Dodoma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Dodoma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Dodoma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Dodoma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Dodoma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Dodoma')" &&
wait
echo all processes complete 3 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Dodoma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Dodoma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Dodoma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Dodoma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Dodoma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Geita')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Geita')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Geita')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Geita')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Geita')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Geita')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Geita')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Geita')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Geita')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Geita')" &&
wait
echo all processes complete 4 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Geita')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Geita')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Iringa')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Iringa')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Iringa')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Iringa')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Iringa')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Iringa')" &&
wait
echo all processes complete 5 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Iringa')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Iringa')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Iringa')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Iringa')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Iringa')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Iringa')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Kagera')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Kagera')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Kagera')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Kagera')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Kagera')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Kagera')" &&
wait
echo all processes complete 6 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Kagera')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Kagera')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Kagera')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Kagera')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Kagera')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Kagera')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Katavi')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Katavi')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Katavi')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Katavi')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Katavi')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Katavi')" &&
wait
echo all processes complete 7 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Katavi')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Katavi')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Katavi')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Katavi')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Katavi')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Katavi')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Kigoma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Kigoma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Kigoma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Kigoma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Kigoma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Kigoma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Kigoma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Kigoma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Kigoma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Kigoma')" &&
wait
echo all processes complete 8 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Kigoma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Kigoma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Kilimanjaro')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Kilimanjaro')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Kilimanjaro')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Kilimanjaro')" &&
wait
echo all processes complete 9 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Kilimanjaro')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Kilimanjaro')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Kilimanjaro')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Kilimanjaro')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Kilimanjaro')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Kilimanjaro')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Kilimanjaro')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Kilimanjaro')" &&
wait
echo all processes complete 10 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Lindi')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Lindi')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Lindi')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Lindi')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Lindi')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Lindi')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Lindi')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Lindi')" &&
wait
echo all processes complete 11 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Lindi')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Lindi')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Lindi')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Lindi')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Manyara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Manyara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Manyara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Manyara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Manyara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Manyara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Manyara')" &&
wait
echo all processes complete 12 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Manyara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Manyara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Manyara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Manyara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Manyara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Mara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Mara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Mara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Mara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Mara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Mara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Mara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Mara')" &&
wait
echo all processes complete 13 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Mara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Mara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Mara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Mara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Mbeya')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Mbeya')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Mbeya')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Mbeya')" &&
wait
echo all processes complete 14 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Mbeya')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Mbeya')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Mbeya')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Mbeya')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Mbeya')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Mbeya')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Mbeya')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Mbeya')" &&
wait
echo all processes complete 15 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Morogoro')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Morogoro')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Morogoro')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Morogoro')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Morogoro')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Morogoro')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Morogoro')" &&
wait
echo all processes complete 16 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Morogoro')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Morogoro')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Morogoro')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Morogoro')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Morogoro')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Mtwara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Mtwara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Mtwara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Mtwara')" &&
wait
echo all processes complete 17 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Mtwara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Mtwara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Mtwara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Mtwara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Mtwara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Mtwara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Mtwara')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Mtwara')" &&
wait
echo all processes complete 18 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Mwanza')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Mwanza')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Mwanza')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Mwanza')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Mwanza')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Mwanza')" &&
wait
echo all processes complete 19 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Mwanza')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Mwanza')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Mwanza')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Mwanza')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Mwanza')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Mwanza')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Njombe')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Njombe')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Njombe')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Njombe')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Njombe')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Njombe')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Njombe')" &&
wait
echo all processes complete 20 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Njombe')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Njombe')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Njombe')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Njombe')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Njombe')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Pwani')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Pwani')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Pwani')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Pwani')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Pwani')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Pwani')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Pwani')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Pwani')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Pwani')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Pwani')" &&
wait
echo all processes complete 21 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Pwani')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Pwani')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Rukwa')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Rukwa')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Rukwa')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Rukwa')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Rukwa')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Rukwa')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Rukwa')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Rukwa')" &&
wait
echo all processes complete 22 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Rukwa')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Rukwa')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Rukwa')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Rukwa')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Ruvuma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Ruvuma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Ruvuma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Ruvuma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Ruvuma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Ruvuma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Ruvuma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Ruvuma')" &&
wait
echo all processes complete 23 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Ruvuma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Ruvuma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Ruvuma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Ruvuma')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Shinyanga')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Shinyanga')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Shinyanga')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Shinyanga')" &&
wait
echo all processes complete 24 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Shinyanga')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Shinyanga')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Shinyanga')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Shinyanga')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Shinyanga')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Shinyanga')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Shinyanga')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Shinyanga')" &&
wait
echo all processes complete 25 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Simiyu')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Simiyu')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Simiyu')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Simiyu')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Simiyu')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Simiyu')" &&
wait
echo all processes complete 26 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Simiyu')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Simiyu')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Simiyu')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Simiyu')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Simiyu')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Simiyu')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Singida')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Singida')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Singida')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Singida')" &&
wait
echo all processes complete 27 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Singida')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Singida')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Singida')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Singida')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Singida')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Singida')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Singida')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Singida')" &&
wait
echo all processes complete 28 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Songwe')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Songwe')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Songwe')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Songwe')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Songwe')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Songwe')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Songwe')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Songwe')" &&
wait
echo all processes complete 29 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Songwe')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Songwe')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Songwe')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Songwe')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Tabora')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Tabora')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Tabora')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Tabora')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Tabora')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Tabora')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Tabora')" &&
wait
echo all processes complete 30 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Tabora')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Tabora')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Tabora')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Tabora')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Tabora')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201607','Tanga')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201608','Tanga')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201609','Tanga')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201610','Tanga')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201611','Tanga')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201612','Tanga')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201701','Tanga')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201702','Tanga')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201703','Tanga')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201704','Tanga')" &&
wait
echo all processes complete 31 of 32
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201705','Tanga')" &
PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('201706','Tanga')" &&
echo Finished Uploading 32 of 32
