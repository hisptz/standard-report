DROP FUNCTION convertCummulative(INTEGER, VARCHAR, VARCHAR, VARCHAR, VARCHAR);
CREATE OR REPLACE FUNCTION convertCummulative(selectedYear INTEGER,data1 VARCHAR,cat1 VARCHAR,data2 VARCHAR,cat2 VARCHAR) RETURNS VARCHAR AS $$
DECLARE
	_c text;
	results VARCHAR;
	isoperiod VARCHAR;
	pisoperiod VARCHAR;
	valueReplacer VARCHAR;
	periodReplacer VARCHAR;
	queryString VARCHAR;
	upsertTemplate VARCHAR = 'INSERT INTO public.datavalue(
                        dataelementid, periodid, sourceid, categoryoptioncomboid, attributeoptioncomboid,
                        value, storedby, lastupdated, comment, created, deleted
                        )
                VALUES (
                        {de}, {pe}, {ou}, {co}, 339884,
                        ''{value}'', ''vincentminde'', now(), '''', now(), FALSE
                        )
                    ON CONFLICT ON CONSTRAINT datavalue_pkey
                    DO UPDATE SET value = ''{value}''
                    WHERE {de} = datavalue.dataelementid AND
                        {pe} = datavalue.periodid AND
                        {ou} = datavalue.sourceid AND
                        {co} = datavalue.categoryoptioncomboid AND
                        datavalue.attributeoptioncomboid = 339884;';
    queryReplacer VARCHAR;
	recorddata RECORD;
BEGIN
	BEGIN
	    /*
	        Create temporary table to hold data
	    */
	    DROP TABLE IF EXISTS _migration_temp;
        CREATE TABLE _migration_temp(
            de1 integer NOT NULL,
            co1 integer NOT NULL,
            de2 integer NOT NULL,
            co2 integer NOT NULL,
            ou  integer NOT NULL,
            plantedvalue07  double precision,
            plantedvalue08  double precision,
            plantedvalue09  double precision,
            plantedvalue10  double precision,
            plantedvalue11  double precision,
            plantedvalue12  double precision,
            plantedvalue01  double precision,
            plantedvalue02  double precision,
            plantedvalue03  double precision,
            plantedvalue04  double precision,
            plantedvalue05  double precision,
            plantedvalue06  double precision,
            productivityvalue07  double precision,
            productivityvalue08  double precision,
            productivityvalue09  double precision,
            productivityvalue10  double precision,
            productivityvalue11  double precision,
            productivityvalue12  double precision,
            productivityvalue01  double precision,
            productivityvalue02  double precision,
            productivityvalue03  double precision,
            productivityvalue04  double precision,
            productivityvalue05  double precision,
            productivityvalue06  double precision,
            submissionstatus07  integer,
            submissionstatus08  integer,
            submissionstatus09  integer,
            submissionstatus10  integer,
            submissionstatus11  integer,
            submissionstatus12  integer,
            submissionstatus01  integer,
            submissionstatus02  integer,
            submissionstatus03  integer,
            submissionstatus04  integer,
            submissionstatus05  integer,
            submissionstatus06  integer,
            CONSTRAINT migration_temp_pkey PRIMARY KEY (de1, co1, de2, co2, ou)
        );

        /*
	        Insert into temporary table the planted area and productivity
	    */
        INSERT INTO _migration_temp (de1, co1, de2, co2, ou
        ,plantedvalue07,plantedvalue08,plantedvalue09,plantedvalue10,plantedvalue11,plantedvalue12,plantedvalue01,plantedvalue02,plantedvalue03,plantedvalue04,plantedvalue05,plantedvalue06
        ,productivityvalue07,productivityvalue08,productivityvalue09,productivityvalue10,productivityvalue11,productivityvalue12,productivityvalue01,productivityvalue02,productivityvalue03,productivityvalue04,productivityvalue05,productivityvalue06
        ,submissionstatus07,submissionstatus08,submissionstatus09,submissionstatus10,submissionstatus11,submissionstatus12,submissionstatus01,submissionstatus02,submissionstatus03,submissionstatus04,submissionstatus05,submissionstatus06
        )
        (
            SELECT datae1.dataelementid, catco1.categoryoptioncomboid, datae2.dataelementid, catco2.categoryoptioncomboid, ou.organisationunitid
            ,cast(plantedarea07.value as double precision),cast(plantedarea08.value as double precision),cast(plantedarea09.value as double precision),cast(plantedarea10.value as double precision),cast(plantedarea11.value as double precision),cast(plantedarea12.value as double precision),cast(plantedarea01.value as double precision),cast(plantedarea02.value as double precision),cast(plantedarea03.value as double precision),cast(plantedarea04.value as double precision),cast(plantedarea05.value as double precision),cast(plantedarea06.value as double precision)
            ,cast(productivity07.value as double precision),cast(productivity08.value as double precision),cast(productivity09.value as double precision),cast(productivity10.value as double precision),cast(productivity11.value as double precision),cast(productivity12.value as double precision),cast(productivity01.value as double precision),cast(productivity02.value as double precision),cast(productivity03.value as double precision),cast(productivity04.value as double precision),cast(productivity05.value as double precision),cast(productivity06.value as double precision)
            ,0,0,0,0,0,0,0,0,0,0,0,0
            FROM (VALUES ('1',data1,cat1,data2,cat2)
            -- ('1','FwpCBGQvYdL','BktmzfgqCjX','ngDrfoi85Oy','BktmzfgqCjX')--,('2','FwpCBGQvYdL','Z0LtVda8wAo','ngDrfoi85Oy','Z0LtVda8wAo'),('3','FwpCBGQvYdL','J6W3kbELkGw','ngDrfoi85Oy','J6W3kbELkGw'),('4','FwpCBGQvYdL','mlpia7QBdqY','ngDrfoi85Oy','mlpia7QBdqY'),('5','FwpCBGQvYdL','oS2Oq1evsaK','ngDrfoi85Oy','oS2Oq1evsaK'),('6','FwpCBGQvYdL','bBKFyBvoo34','ngDrfoi85Oy','bBKFyBvoo34')
            --,('7','FwpCBGQvYdL','zSS1gwkIIu8','ngDrfoi85Oy','zSS1gwkIIu8'),('8','sS5OudDzXC2','ql8bSsHEnUN','FyJxMp5u7WP','ql8bSsHEnUN'),('9','sS5OudDzXC2','pcsiYqIW4kJ','FyJxMp5u7WP','pcsiYqIW4kJ'),('10','sS5OudDzXC2','YwRiKDxpYON','FyJxMp5u7WP','YwRiKDxpYON'),('11','sS5OudDzXC2','YkeweM90DZt','FyJxMp5u7WP','YkeweM90DZt'),('12','sS5OudDzXC2','pjXHRQQXIhg','FyJxMp5u7WP','pjXHRQQXIhg')
            --,('13','mVwNk3foz3v','hRHZBt0hok2','cf9SaENrA27','hRHZBt0hok2'),('14','mVwNk3foz3v','r5YXWoMvsX4','cf9SaENrA27','r5YXWoMvsX4'),('15','mVwNk3foz3v','g8e3yoakYec','cf9SaENrA27','g8e3yoakYec'),('16','mVwNk3foz3v','nxSBayfWRix','cf9SaENrA27','nxSBayfWRix'),('17','mVwNk3foz3v','CL9bLTJRESL','cf9SaENrA27','CL9bLTJRESL'),('18','mVwNk3foz3v','JnGowCNPR09','cf9SaENrA27','JnGowCNPR09')
            --,('19','mVwNk3foz3v','nxsGR3eo7aj','cf9SaENrA27','nxsGR3eo7aj'),('20','mVwNk3foz3v','syxO1e4huIX','cf9SaENrA27','syxO1e4huIX'),('21','mVwNk3foz3v','bkfyCurKXWV','cf9SaENrA27','bkfyCurKXWV'),('22','mVwNk3foz3v','ystqt8VT4Tp','cf9SaENrA27','ystqt8VT4Tp'),('23','mVwNk3foz3v','WpsmWKDTfdX','cf9SaENrA27','WpsmWKDTfdX'),('24','mVwNk3foz3v','D116dzscO4G','cf9SaENrA27','D116dzscO4G')
            --,('25','gbvUDbZWxUS','wJIxAhejWKY','dozTSGrBvVj','wJIxAhejWKY'),('26','gbvUDbZWxUS','R5DIMqSCTA5','dozTSGrBvVj','R5DIMqSCTA5'),('27','gbvUDbZWxUS','xCnCQxpSTUJ','dozTSGrBvVj','xCnCQxpSTUJ'),('28','gbvUDbZWxUS','iBa5lgXgvwk','dozTSGrBvVj','iBa5lgXgvwk'),('29','gbvUDbZWxUS','v3Eq35RuqEA','dozTSGrBvVj','v3Eq35RuqEA'),('30','gbvUDbZWxUS','bltcOiiZeO5','dozTSGrBvVj','bltcOiiZeO5')
            --,('31','gbvUDbZWxUS','uMeEFdAzqKS','dozTSGrBvVj','uMeEFdAzqKS'),('32','gbvUDbZWxUS','AqholFtHhlg','dozTSGrBvVj','AqholFtHhlg'),('33','rBstKKNXmYA','jjfebeJ6pbV','QnFeukGopwx','jjfebeJ6pbV'),('34','rBstKKNXmYA','BYTuIQ47dnS','QnFeukGopwx','BYTuIQ47dnS'),('35','rBstKKNXmYA','lJ9Cv8ISZRT','QnFeukGopwx','lJ9Cv8ISZRT'),('36','rBstKKNXmYA','xLi4aE2hf45','QnFeukGopwx','xLi4aE2hf45')
            --,('37','rBstKKNXmYA','eHhQeZB29hz','QnFeukGopwx','eHhQeZB29hz'),('38','rBstKKNXmYA','b5D4IKJFDJH','QnFeukGopwx','b5D4IKJFDJH'),('39','rBstKKNXmYA','vXOb5h9Rxqs','QnFeukGopwx','vXOb5h9Rxqs'),('40','rBstKKNXmYA','OEoQ7kif63L','QnFeukGopwx','OEoQ7kif63L'),('41','bJ84f27rqDB','MT4SwuoV2pQ','qRvbTVEmI6C','MT4SwuoV2pQ'),('42','bJ84f27rqDB','Y1zhvDQTe5e','qRvbTVEmI6C','Y1zhvDQTe5e')
            --,('43','bJ84f27rqDB','Efwc5ipDSTk','qRvbTVEmI6C','Efwc5ipDSTk'),('44','bJ84f27rqDB','WAl6t24Jpzt','qRvbTVEmI6C','WAl6t24Jpzt'),('45','bJ84f27rqDB','uQqzzomp9tc','qRvbTVEmI6C','uQqzzomp9tc'),('46','bJ84f27rqDB','ICiTJsU1Vec','qRvbTVEmI6C','ICiTJsU1Vec'),('47','bJ84f27rqDB','TZJQRkPRJm4','qRvbTVEmI6C','TZJQRkPRJm4'),('48','bJ84f27rqDB','jC7AWcjBkJ3','qRvbTVEmI6C','jC7AWcjBkJ3')
            --,('49','bJ84f27rqDB','BPGkOcPjPS7','qRvbTVEmI6C','BPGkOcPjPS7'),('50','bJ84f27rqDB','nMMaTQxdPJG','qRvbTVEmI6C','nMMaTQxdPJG'),('51','bJ84f27rqDB','HdPaWqoDpdZ','qRvbTVEmI6C','HdPaWqoDpdZ'),('52','YSRj2rXWC0f','tPbRcvnWxkS','xpXXurlwbNM','tPbRcvnWxkS'),('53','YSRj2rXWC0f','fXZ1QJJJ9wp','xpXXurlwbNM','fXZ1QJJJ9wp'),('54','YSRj2rXWC0f','Z4bVJVRPKjl','xpXXurlwbNM','Z4bVJVRPKjl')
            --,('55','YSRj2rXWC0f','pAB6StXtLU8','xpXXurlwbNM','pAB6StXtLU8'),('56','YSRj2rXWC0f','BEi0yw6WwBa','xpXXurlwbNM','BEi0yw6WwBa'),('57','YSRj2rXWC0f','w30fA5rFeRV','xpXXurlwbNM','w30fA5rFeRV'),('58','YSRj2rXWC0f','Bkz2vXNsYke','xpXXurlwbNM','Bkz2vXNsYke'),('59','YSRj2rXWC0f','Heme7D8HT30','xpXXurlwbNM','Heme7D8HT30'),('60','YSRj2rXWC0f','VIPqyvWbwDU','xpXXurlwbNM','VIPqyvWbwDU')
            --,('61','YSRj2rXWC0f','dUIkQFWg2qm','xpXXurlwbNM','dUIkQFWg2qm'),('62','YSRj2rXWC0f','H9p6YVxG7zJ','xpXXurlwbNM','H9p6YVxG7zJ'),('63','YSRj2rXWC0f','JIeF7OCEt6D','xpXXurlwbNM','JIeF7OCEt6D'),('64','YSRj2rXWC0f','bSNT1r88kIC','xpXXurlwbNM','bSNT1r88kIC'),('65','YSRj2rXWC0f','i9b5kFnGOkF','xpXXurlwbNM','i9b5kFnGOkF'),('66','YSRj2rXWC0f','hkdaOo9ZpB2','xpXXurlwbNM','hkdaOo9ZpB2')
            --,('67','YSRj2rXWC0f','rwsWnkaJ5HR','xpXXurlwbNM','rwsWnkaJ5HR'),('68','YSRj2rXWC0f','wTlpU2TaHiz','xpXXurlwbNM','wTlpU2TaHiz'),('69','YSRj2rXWC0f','a4OM9bKggAT','xpXXurlwbNM','a4OM9bKggAT'),('70','WoUIOUcej6W','fuzYIcfLZN2','lcdIDgumilv','fuzYIcfLZN2'),('71','WoUIOUcej6W','HquzVesvM2Z','lcdIDgumilv','HquzVesvM2Z'),('72','WoUIOUcej6W','BJuZMglWlTz','lcdIDgumilv','BJuZMglWlTz')
            --,('73','WoUIOUcej6W','GmO6g98S4G9','lcdIDgumilv','GmO6g98S4G9'),('74','WoUIOUcej6W','wfxDF7iGY3f','lcdIDgumilv','wfxDF7iGY3f'),('75','WoUIOUcej6W','QlQ95KGkgR6','lcdIDgumilv','QlQ95KGkgR6'),('76','WoUIOUcej6W','nrQIoh49aGU','lcdIDgumilv','nrQIoh49aGU'),('77','WoUIOUcej6W','ZbmI2XtXHIS','lcdIDgumilv','ZbmI2XtXHIS'),('78','WoUIOUcej6W','dUwc6pkKgmM','lcdIDgumilv','dUwc6pkKgmM')
            --,('79','WoUIOUcej6W','drXDRIxLVzv','lcdIDgumilv','drXDRIxLVzv'),('80','WoUIOUcej6W','dqChjQjl0ZH','lcdIDgumilv','dqChjQjl0ZH'),('81','WoUIOUcej6W','oplxxXgoehP','lcdIDgumilv','oplxxXgoehP'),('82','WoUIOUcej6W','SyDcaTOW0JP','lcdIDgumilv','SyDcaTOW0JP'),('83','WoUIOUcej6W','XckkuoyUldR','lcdIDgumilv','XckkuoyUldR'),('84','WoUIOUcej6W','GtUrKU93piR','lcdIDgumilv','GtUrKU93piR')
            --,('85','WoUIOUcej6W','Hmz6lySVDCN','lcdIDgumilv','Hmz6lySVDCN'),('86','WoUIOUcej6W','QDSfLpYNZ3l','lcdIDgumilv','QDSfLpYNZ3l'),('87','nc1E1TyiGhG','zPf9YtxdJJH','rNaeaP69Ml0','zPf9YtxdJJH'),('88','nc1E1TyiGhG','D4phPJP6u9V','rNaeaP69Ml0','D4phPJP6u9V'),('89','nc1E1TyiGhG','MvHtsSwbho2','rNaeaP69Ml0','MvHtsSwbho2'),('90','nc1E1TyiGhG','e27Rj8LSYQV','rNaeaP69Ml0','e27Rj8LSYQV')
            --,('91','nc1E1TyiGhG','pq1B5YRvk3w','rNaeaP69Ml0','pq1B5YRvk3w'),('92','nc1E1TyiGhG','hOj19H7Vodn','rNaeaP69Ml0','hOj19H7Vodn'),('93','nc1E1TyiGhG','mQjKnpOz1I8','rNaeaP69Ml0','mQjKnpOz1I8'),('94','uNGeyGIsN7W','deTgGupUgr3','SXvP3NECeFk','deTgGupUgr3')
            )
            as dimesions(id, de1, co1, de2, co2)
            INNER JOIN dataelement datae1 ON(datae1.uid = dimesions.de1)
            INNER JOIN dataelement datae2 ON(datae2.uid = dimesions.de2)
            INNER JOIN categoryoptioncombo catco1 ON(catco1.uid = dimesions.co1)
            INNER JOIN categoryoptioncombo catco2 ON(catco2.uid = dimesions.co2)
            INNER JOIN organisationunit ou ON(ou.hierarchylevel = 4)
            INNER JOIN _periodstructure pe07 ON(pe07.iso = selectedYear || '07')
            INNER JOIN _periodstructure pe08 ON(pe08.iso = selectedYear || '08')
            INNER JOIN _periodstructure pe09 ON(pe09.iso = selectedYear || '09')
            INNER JOIN _periodstructure pe10 ON(pe10.iso = selectedYear || '10')
            INNER JOIN _periodstructure pe11 ON(pe11.iso = selectedYear || '11')
            INNER JOIN _periodstructure pe12 ON(pe12.iso = selectedYear || '12')
            INNER JOIN _periodstructure pe01 ON(pe01.iso = selectedYear + 1 || '01')
            INNER JOIN _periodstructure pe02 ON(pe02.iso = selectedYear + 1 || '02')
            INNER JOIN _periodstructure pe03 ON(pe03.iso = selectedYear + 1 || '03')
            INNER JOIN _periodstructure pe04 ON(pe04.iso = selectedYear + 1 || '04')
            INNER JOIN _periodstructure pe05 ON(pe05.iso = selectedYear + 1 || '05')
            INNER JOIN _periodstructure pe06 ON(pe06.iso = selectedYear + 1 || '06')
            LEFT JOIN datavalue plantedarea07 ON(pe07.periodid = plantedarea07.periodid AND ou.organisationunitid = plantedarea07.sourceid AND plantedarea07.dataelementid = datae1.dataelementid AND plantedarea07.categoryoptioncomboid = catco1.categoryoptioncomboid AND plantedarea07.attributeoptioncomboid = 339884)
            LEFT JOIN datavalue plantedarea08 ON(pe08.periodid = plantedarea08.periodid AND ou.organisationunitid = plantedarea08.sourceid AND plantedarea08.dataelementid = datae1.dataelementid AND plantedarea08.categoryoptioncomboid = catco1.categoryoptioncomboid AND plantedarea08.attributeoptioncomboid = 339884)

            LEFT JOIN datavalue plantedarea09 ON(pe09.periodid = plantedarea09.periodid AND ou.organisationunitid = plantedarea09.sourceid AND plantedarea09.dataelementid = datae1.dataelementid AND plantedarea09.categoryoptioncomboid = catco1.categoryoptioncomboid AND plantedarea09.attributeoptioncomboid = 339884)

            LEFT JOIN datavalue plantedarea10 ON(pe10.periodid = plantedarea10.periodid AND ou.organisationunitid = plantedarea10.sourceid AND plantedarea10.dataelementid = datae1.dataelementid AND plantedarea10.categoryoptioncomboid = catco1.categoryoptioncomboid AND plantedarea10.attributeoptioncomboid = 339884)

            LEFT JOIN datavalue plantedarea11 ON(pe11.periodid = plantedarea11.periodid AND ou.organisationunitid = plantedarea11.sourceid AND plantedarea11.dataelementid = datae1.dataelementid AND plantedarea11.categoryoptioncomboid = catco1.categoryoptioncomboid AND plantedarea11.attributeoptioncomboid = 339884)

            LEFT JOIN datavalue plantedarea12 ON(pe12.periodid = plantedarea12.periodid AND ou.organisationunitid = plantedarea12.sourceid AND plantedarea12.dataelementid = datae1.dataelementid AND plantedarea12.categoryoptioncomboid = catco1.categoryoptioncomboid AND plantedarea12.attributeoptioncomboid = 339884)

            LEFT JOIN datavalue plantedarea01 ON(pe01.periodid = plantedarea01.periodid AND ou.organisationunitid = plantedarea01.sourceid AND plantedarea01.dataelementid = datae1.dataelementid AND plantedarea01.categoryoptioncomboid = catco1.categoryoptioncomboid AND plantedarea01.attributeoptioncomboid = 339884)

            LEFT JOIN datavalue plantedarea02 ON(pe02.periodid = plantedarea02.periodid AND ou.organisationunitid = plantedarea02.sourceid AND plantedarea02.dataelementid = datae1.dataelementid AND plantedarea02.categoryoptioncomboid = catco1.categoryoptioncomboid AND plantedarea02.attributeoptioncomboid = 339884)

            LEFT JOIN datavalue plantedarea03 ON(pe03.periodid = plantedarea03.periodid AND ou.organisationunitid = plantedarea03.sourceid AND plantedarea03.dataelementid = datae1.dataelementid AND plantedarea03.categoryoptioncomboid = catco1.categoryoptioncomboid AND plantedarea03.attributeoptioncomboid = 339884)

            LEFT JOIN datavalue plantedarea04 ON(pe04.periodid = plantedarea04.periodid AND ou.organisationunitid = plantedarea04.sourceid AND plantedarea04.dataelementid = datae1.dataelementid AND plantedarea04.categoryoptioncomboid = catco1.categoryoptioncomboid AND plantedarea04.attributeoptioncomboid = 339884)

            LEFT JOIN datavalue plantedarea05 ON(pe05.periodid = plantedarea05.periodid AND ou.organisationunitid = plantedarea05.sourceid AND plantedarea05.dataelementid = datae1.dataelementid AND plantedarea05.categoryoptioncomboid = catco1.categoryoptioncomboid AND plantedarea05.attributeoptioncomboid = 339884)

            LEFT JOIN datavalue plantedarea06 ON(pe06.periodid = plantedarea06.periodid AND ou.organisationunitid = plantedarea06.sourceid AND plantedarea06.dataelementid = datae1.dataelementid AND plantedarea06.categoryoptioncomboid = catco1.categoryoptioncomboid AND plantedarea06.attributeoptioncomboid = 339884)

            -- Adding Completeness
            /*LEFT JOIN completedatasetregistration cdsr07 ON(cdsr07.datasetid = ds.datasetid AND cdsr07.periodid = pe07.periodid AND cdsr07.sourceid = ou.organisationunitid)
            LEFT JOIN completedatasetregistration cdsr08 ON(cdsr08.datasetid = ds.datasetid AND cdsr08.periodid = pe08.periodid AND cdsr08.sourceid = ou.organisationunitid)
            LEFT JOIN completedatasetregistration cdsr09 ON(cdsr09.datasetid = ds.datasetid AND cdsr09.periodid = pe09.periodid AND cdsr09.sourceid = ou.organisationunitid)
            LEFT JOIN completedatasetregistration cdsr10 ON(cdsr10.datasetid = ds.datasetid AND cdsr10.periodid = pe10.periodid AND cdsr10.sourceid = ou.organisationunitid)
            LEFT JOIN completedatasetregistration cdsr11 ON(cdsr11.datasetid = ds.datasetid AND cdsr11.periodid = pe11.periodid AND cdsr11.sourceid = ou.organisationunitid)
            LEFT JOIN completedatasetregistration cdsr12 ON(cdsr12.datasetid = ds.datasetid AND cdsr12.periodid = pe12.periodid AND cdsr12.sourceid = ou.organisationunitid)
            LEFT JOIN completedatasetregistration cdsr01 ON(cdsr01.datasetid = ds.datasetid AND cdsr01.periodid = pe01.periodid AND cdsr01.sourceid = ou.organisationunitid)
            LEFT JOIN completedatasetregistration cdsr02 ON(cdsr02.datasetid = ds.datasetid AND cdsr02.periodid = pe02.periodid AND cdsr02.sourceid = ou.organisationunitid)
            LEFT JOIN completedatasetregistration cdsr03 ON(cdsr03.datasetid = ds.datasetid AND cdsr03.periodid = pe03.periodid AND cdsr03.sourceid = ou.organisationunitid)
            LEFT JOIN completedatasetregistration cdsr04 ON(cdsr04.datasetid = ds.datasetid AND cdsr04.periodid = pe04.periodid AND cdsr04.sourceid = ou.organisationunitid)
            LEFT JOIN completedatasetregistration cdsr05 ON(cdsr05.datasetid = ds.datasetid AND cdsr05.periodid = pe05.periodid AND cdsr05.sourceid = ou.organisationunitid)
            LEFT JOIN completedatasetregistration cdsr06 ON(cdsr06.datasetid = ds.datasetid AND cdsr06.periodid = pe06.periodid AND cdsr06.sourceid = ou.organisationunitid)*/

            -- Planted Area Values
            -- Productivity values
            LEFT JOIN datavalue productivity07 ON(pe07.periodid = productivity07.periodid AND ou.organisationunitid = productivity07.sourceid AND productivity07.dataelementid = datae2.dataelementid AND productivity07.categoryoptioncomboid = catco2.categoryoptioncomboid AND productivity07.attributeoptioncomboid = 339884)
            LEFT JOIN datavalue productivity08 ON(pe08.periodid = productivity08.periodid AND ou.organisationunitid = productivity08.sourceid AND productivity08.dataelementid = datae2.dataelementid AND productivity08.categoryoptioncomboid = catco2.categoryoptioncomboid AND productivity08.attributeoptioncomboid = 339884)
            LEFT JOIN datavalue productivity09 ON(pe09.periodid = productivity09.periodid AND ou.organisationunitid = productivity09.sourceid AND productivity09.dataelementid = datae2.dataelementid AND productivity09.categoryoptioncomboid = catco2.categoryoptioncomboid AND productivity09.attributeoptioncomboid = 339884)
            LEFT JOIN datavalue productivity10 ON(pe10.periodid = productivity10.periodid AND ou.organisationunitid = productivity10.sourceid AND productivity10.dataelementid = datae2.dataelementid AND productivity10.categoryoptioncomboid = catco2.categoryoptioncomboid AND productivity10.attributeoptioncomboid = 339884)
            LEFT JOIN datavalue productivity11 ON(pe11.periodid = productivity11.periodid AND ou.organisationunitid = productivity11.sourceid AND productivity11.dataelementid = datae2.dataelementid AND productivity11.categoryoptioncomboid = catco2.categoryoptioncomboid AND productivity11.attributeoptioncomboid = 339884)
            LEFT JOIN datavalue productivity12 ON(pe12.periodid = productivity12.periodid AND ou.organisationunitid = productivity12.sourceid AND productivity12.dataelementid = datae2.dataelementid AND productivity12.categoryoptioncomboid = catco2.categoryoptioncomboid AND productivity12.attributeoptioncomboid = 339884)
            LEFT JOIN datavalue productivity01 ON(pe01.periodid = productivity01.periodid AND ou.organisationunitid = productivity01.sourceid AND productivity01.dataelementid = datae2.dataelementid AND productivity01.categoryoptioncomboid = catco2.categoryoptioncomboid AND productivity01.attributeoptioncomboid = 339884)
            LEFT JOIN datavalue productivity02 ON(pe02.periodid = productivity02.periodid AND ou.organisationunitid = productivity02.sourceid AND productivity02.dataelementid = datae2.dataelementid AND productivity02.categoryoptioncomboid = catco2.categoryoptioncomboid AND productivity02.attributeoptioncomboid = 339884)
            LEFT JOIN datavalue productivity03 ON(pe03.periodid = productivity03.periodid AND ou.organisationunitid = productivity03.sourceid AND productivity03.dataelementid = datae2.dataelementid AND productivity03.categoryoptioncomboid = catco2.categoryoptioncomboid AND productivity03.attributeoptioncomboid = 339884)
            LEFT JOIN datavalue productivity04 ON(pe04.periodid = productivity04.periodid AND ou.organisationunitid = productivity04.sourceid AND productivity04.dataelementid = datae2.dataelementid AND productivity04.categoryoptioncomboid = catco2.categoryoptioncomboid AND productivity04.attributeoptioncomboid = 339884)
            LEFT JOIN datavalue productivity05 ON(pe05.periodid = productivity05.periodid AND ou.organisationunitid = productivity05.sourceid AND productivity05.dataelementid = datae2.dataelementid AND productivity05.categoryoptioncomboid = catco2.categoryoptioncomboid AND productivity05.attributeoptioncomboid = 339884)
            LEFT JOIN datavalue productivity06 ON(pe06.periodid = productivity06.periodid AND ou.organisationunitid = productivity06.sourceid AND productivity06.dataelementid = datae2.dataelementid AND productivity06.categoryoptioncomboid = catco2.categoryoptioncomboid AND productivity06.attributeoptioncomboid = 339884)

        );

        -- Set the completeness status

        FOREACH isoperiod IN array string_to_array(selectedYear||'07,' || selectedYear||'08,' || selectedYear|| '09,'|| selectedYear|| '10,'|| selectedYear|| '11,'|| selectedYear|| '12,'|| selectedYear + 1|| '01,'|| selectedYear + 1 || '02,'|| selectedYear + 1 || '03,'|| selectedYear + 1 || '04,'|| selectedYear + 1 || '05,'|| selectedYear + 1 || '06', ',') LOOP
            queryString ='UPDATE _migration_temp SET submissionstatus'|| substring(isoperiod,5) ||' = 1
            WHERE ou IN (
                SELECT cdsr.sourceid FROM completedatasetregistration cdsr
                INNER JOIN _periodstructure pe ON(cdsr.periodid = pe.periodid AND pe.iso = '''|| isoperiod ||''')
                WHERE cdsr.datasetid = 1512

            );';
            --RAISE NOTICE 'Query:% ', queryString;
            EXECUTE queryString;

        END LOOP;

        COPY (select * from _migration_temp) TO '/tmp/table2.1_2017_original.csv' WITH CSV HEADER;
        -- Perform adjustment #1 Fix missing data


        -- Set planted area and productivity to 0 if it is null and the form has been submitted

        FOREACH isoperiod IN array string_to_array(selectedYear||'07,' ||selectedYear||'08,' || selectedYear|| '09,'|| selectedYear|| '10,'|| selectedYear|| '11,'|| selectedYear|| '12,'|| selectedYear + 1|| '01,'|| selectedYear + 1 || '02,'|| selectedYear + 1 || '03,'|| selectedYear + 1 || '04,'|| selectedYear + 1 || '05,'|| selectedYear + 1 || '06', ',') LOOP
            queryString ='UPDATE _migration_temp SET plantedvalue'|| substring(isoperiod,5) ||' = 0
            WHERE submissionstatus'|| substring(isoperiod,5) ||' = 1 AND plantedvalue'|| substring(isoperiod,5) ||' IS NULL;';
            --RAISE NOTICE 'Query:% ', queryString;
            queryString = concat(queryString,'UPDATE _migration_temp SET productivityvalue'|| substring(isoperiod,5) ||' = 0
            WHERE submissionstatus'|| substring(isoperiod,5) ||' = 1 AND productivityvalue'|| substring(isoperiod,5) ||' IS NULL;');
            EXECUTE queryString;

        END LOOP;
        -- Set Null to all un submitted forms
    UPDATE _migration_temp SET plantedvalue07 = 0 WHERE submissionstatus07 = 0;
    UPDATE _migration_temp SET productivityvalue07 = 0 WHERE submissionstatus07 = 0;
    -- Set planted area and productivity to previous values if the form was not submitted

    FOREACH isoperiod IN array string_to_array(selectedYear||'08,' || selectedYear|| '09,'|| selectedYear|| '10,'|| selectedYear|| '11,'|| selectedYear|| '12,'|| selectedYear + 1|| '01,'|| selectedYear + 1 || '02,'|| selectedYear + 1 || '03,'|| selectedYear + 1 || '04,'|| selectedYear + 1 || '05,'|| selectedYear + 1 || '06', ',') LOOP

        pisoperiod = cast(cast(isoperiod as integer) - 1 as VARCHAR);
        IF substring(isoperiod,5) = '01' THEN
            pisoperiod = cast(cast(substring(isoperiod,1,4) as integer) - 1 as VARCHAR) || '12';
        END IF;
        queryString = 'UPDATE _migration_temp set plantedvalue' || substring(isoperiod,5,2) || ' = plantedvalue' || substring(pisoperiod,5,2) ||
        ',productivityvalue' || substring(isoperiod,5,2) ||' = productivityvalue' || substring(pisoperiod,5,2) ||
        ' WHERE submissionstatus'|| substring(isoperiod,5) ||' = 0;';
        --RAISE NOTICE 'Query:%', queryString;
        EXECUTE queryString;

    END LOOP;

    -- Perform Adjustment #2:  Fix Same Planted Area but different Productivity -  Add 0.1 to make the planted areas different
    --FOREACH isoperiod IN array string_to_array(selectedYear + 1||'06,' || selectedYear + 1|| '05,'|| selectedYear+1 || '04,'|| selectedYear+1 || '03,'|| selectedYear+1 || '02,'|| selectedYear +1 || '01,'|| selectedYear || '12,'|| selectedYear || '11,'|| selectedYear || '10,'|| selectedYear || '09,'|| selectedYear || '08', ',') LOOP
        --FOREACH isoperiod IN array string_to_array(selectedYear + 1||'06,' || selectedYear + 1|| '05,'|| selectedYear+1 || '04,'|| selectedYear+1 || '03,'|| selectedYear+1 || '02,'|| selectedYear +1 || '01,'|| selectedYear || '12,'|| selectedYear || '11,'|| selectedYear || '10,'|| selectedYear || '09,'|| selectedYear || '08', ',') LOOP
        FOREACH isoperiod IN array string_to_array(selectedYear||'08,' || selectedYear|| '09,'|| selectedYear|| '10,'|| selectedYear|| '11,'|| selectedYear|| '12,'|| selectedYear + 1|| '01,'|| selectedYear + 1 || '02,'|| selectedYear + 1 || '03,'|| selectedYear + 1 || '04,'|| selectedYear + 1 || '05,'|| selectedYear + 1 || '06', ',') LOOP

            pisoperiod = cast(cast(isoperiod as integer) - 1 as VARCHAR);
            IF substring(isoperiod,5) = '01' THEN
                pisoperiod = cast(cast(substring(isoperiod,1,4) as integer) - 1 as VARCHAR) || '12';
            END IF;
            --RAISE NOTICE 'Period:% Previous:%', isoperiod, pisoperiod;
            EXECUTE 'UPDATE _migration_temp set plantedvalue' || substring(isoperiod,5,2) || ' = plantedvalue' || substring(pisoperiod,5,2) ||' + 0.1' ||
            ' WHERE plantedvalue' || substring(isoperiod,5,2) ||' = plantedvalue'
            || substring(pisoperiod,5,2) ||' AND productivityvalue' || substring(isoperiod,5,2)
            ||' <> productivityvalue' || substring(pisoperiod,5,2) ||' AND  plantedvalue' || substring(isoperiod,5,2) ||' <> 0  AND submissionstatus' || substring(isoperiod,5,2)
            ||' = 1;UPDATE _migration_temp set plantedvalue' || substring(isoperiod,5,2) || ' = plantedvalue' || substring(pisoperiod,5,2) ||
      ' WHERE submissionstatus' || substring(isoperiod,5,2) ||' = 0' || ';';

        END LOOP;
    --END LOOP;

    -- Perform migration of productivity column
    --FOREACH isoperiod IN array string_to_array(selectedYear||'08,' || selectedYear|| '09,'|| selectedYear|| '10,'|| selectedYear|| '11,'|| selectedYear|| '12,'|| selectedYear + 1|| '01,'|| selectedYear + 1 || '02,'|| selectedYear + 1 || '03,'|| selectedYear + 1 || '04,'|| selectedYear + 1 || '05,'|| selectedYear + 1 || '06', ',') LOOP
    FOREACH isoperiod IN array string_to_array(selectedYear + 1||'06,' || selectedYear + 1|| '05,'|| selectedYear+1 || '04,'|| selectedYear+1 || '03,'|| selectedYear+1 || '02,'|| selectedYear +1 || '01,'|| selectedYear || '12,'|| selectedYear || '11,'|| selectedYear || '10,'|| selectedYear || '09,'|| selectedYear || '08', ',') LOOP
        pisoperiod = cast(cast(isoperiod as integer) - 1 as VARCHAR);
        IF substring(isoperiod,5) = '01' THEN
            pisoperiod = cast(cast(substring(isoperiod,1,4) as integer) - 1 as VARCHAR) || '12';
        END IF;
        -- Calculate productivity with formula (a[n]*b[n] - a[n-1]*b[n-1]) / = (a[n] - a[n-1])
        queryString = 'UPDATE _migration_temp set productivityvalue' || substring(isoperiod,5,2) || ' = (plantedvalue' || substring(isoperiod,5,2) ||
        ' * productivityvalue' || substring(isoperiod,5,2) || ' - plantedvalue' || substring(pisoperiod,5,2) ||
        ' * productivityvalue' || substring(pisoperiod,5,2) || ')/(plantedvalue' || substring(isoperiod,5,2) ||
        ' - plantedvalue' || substring(pisoperiod,5,2) || ') WHERE (plantedvalue' || substring(isoperiod,5,2) ||
        ' - plantedvalue' || substring(pisoperiod,5,2) || ') <> 0;';
        --RAISE NOTICE 'Query:%', queryString;
        EXECUTE queryString;

        queryString = 'UPDATE _migration_temp set productivityvalue' || substring(isoperiod,5,2) || ' = 0 WHERE (plantedvalue' || substring(isoperiod,5,2) ||
        ' - plantedvalue' || substring(pisoperiod,5,2) || ') = 0;';
        EXECUTE queryString;
    END LOOP;

    -- Perform migration of planted area
    --FOREACH isoperiod IN array string_to_array(selectedYear||'08,' || selectedYear|| '09,'|| selectedYear|| '10,'|| selectedYear|| '11,'|| selectedYear|| '12,'|| selectedYear + 1|| '01,'|| selectedYear + 1 || '02,'|| selectedYear + 1 || '03,'|| selectedYear + 1 || '04,'|| selectedYear + 1 || '05,'|| selectedYear + 1 || '06', ',') LOOP
    FOREACH isoperiod IN array string_to_array(selectedYear + 1||'06,' || selectedYear + 1|| '05,'|| selectedYear+1 || '04,'|| selectedYear+1 || '03,'|| selectedYear+1 || '02,'|| selectedYear +1 || '01,'|| selectedYear || '12,'|| selectedYear || '11,'|| selectedYear || '10,'|| selectedYear || '09,'|| selectedYear || '08', ',') LOOP
        pisoperiod = cast(cast(isoperiod as integer) - 1 as VARCHAR);
        IF substring(isoperiod,5) = '01' THEN
            pisoperiod = cast(cast(substring(isoperiod,1,4) as integer) - 1 as VARCHAR) || '12';
        END IF;
        -- Calculate planted area with formula a[n] - a[n-1]
        EXECUTE 'UPDATE _migration_temp set plantedvalue' || substring(isoperiod,5,2) || ' = plantedvalue' || substring(isoperiod,5,2) || ' - plantedvalue' || substring(pisoperiod,5,2) || ';';
    END LOOP;

    COPY (select * from _migration_temp) TO '/tmp/table2.1_2017_converted.csv' WITH CSV HEADER;
    -- Update the data value table with new values



    FOREACH isoperiod IN array string_to_array(selectedYear||'08,' || selectedYear|| '09,'|| selectedYear|| '10,'|| selectedYear|| '11,'|| selectedYear|| '12,'|| selectedYear + 1|| '01,'|| selectedYear + 1 || '02,'|| selectedYear + 1 || '03,'|| selectedYear + 1 || '04,'|| selectedYear + 1 || '05,'|| selectedYear + 1 || '06', ',') LOOP
            -- Update Planted area data
        queryString = '';
        FOR recorddata IN EXECUTE 'SELECT * FROM _migration_temp WHERE submissionstatus' || substring(isoperiod,5) || ' = 1' LOOP

            CASE
                WHEN substring(isoperiod,5) = '01' THEN
                    valueReplacer = recorddata.plantedvalue01;
                WHEN substring(isoperiod,5) = '02' THEN
                    valueReplacer = recorddata.plantedvalue02;
                WHEN substring(isoperiod,5) = '03' THEN
                    valueReplacer = recorddata.plantedvalue03;
                WHEN substring(isoperiod,5) = '04' THEN
                    valueReplacer = recorddata.plantedvalue04;
                WHEN substring(isoperiod,5) = '05' THEN
                    valueReplacer = recorddata.plantedvalue05;
                WHEN substring(isoperiod,5) = '06' THEN
                    valueReplacer = recorddata.plantedvalue06;
                WHEN substring(isoperiod,5) = '07' THEN
                    valueReplacer = recorddata.plantedvalue07;
                WHEN substring(isoperiod,5) = '08' THEN
                    valueReplacer = recorddata.plantedvalue08;
                WHEN substring(isoperiod,5) = '09' THEN
                    valueReplacer = recorddata.plantedvalue09;
                WHEN substring(isoperiod,5) = '10' THEN
                    valueReplacer = recorddata.plantedvalue10;
                WHEN substring(isoperiod,5) = '11' THEN
                    valueReplacer = recorddata.plantedvalue11;
                WHEN substring(isoperiod,5) = '12' THEN
                    valueReplacer = recorddata.plantedvalue12;
                ELSE

            END CASE;
            SELECT periodid INTO periodReplacer FROM _periodstructure WHERE iso = isoperiod;
            queryReplacer = REPLACE(upsertTemplate,'{de}',cast(recorddata.de1 as VARCHAR));
            queryReplacer = REPLACE(queryReplacer,'{co}',cast(recorddata.co1 as VARCHAR));
            queryReplacer = REPLACE(queryReplacer,'{ou}',cast(recorddata.ou as VARCHAR));
            queryReplacer = REPLACE(queryReplacer,'{pe}',cast(periodReplacer as VARCHAR));
            queryReplacer = REPLACE(queryReplacer,'{value}',valueReplacer);
            queryString = concat(queryString, queryReplacer);
            -- Update productivity  data
            CASE
                WHEN substring(isoperiod,5) = '01' THEN
                    valueReplacer = recorddata.productivityvalue01;
                WHEN substring(isoperiod,5) = '02' THEN
                    valueReplacer = recorddata.productivityvalue02;
                WHEN substring(isoperiod,5) = '03' THEN
                    valueReplacer = recorddata.productivityvalue03;
                WHEN substring(isoperiod,5) = '04' THEN
                    valueReplacer = recorddata.productivityvalue04;
                WHEN substring(isoperiod,5) = '05' THEN
                    valueReplacer = recorddata.productivityvalue05;
                WHEN substring(isoperiod,5) = '06' THEN
                    valueReplacer = recorddata.productivityvalue06;
                WHEN substring(isoperiod,5) = '07' THEN
                    valueReplacer = recorddata.productivityvalue07;
                WHEN substring(isoperiod,5) = '08' THEN
                    valueReplacer = recorddata.productivityvalue08;
                WHEN substring(isoperiod,5) = '09' THEN
                    valueReplacer = recorddata.productivityvalue09;
                WHEN substring(isoperiod,5) = '10' THEN
                    valueReplacer = recorddata.productivityvalue10;
                WHEN substring(isoperiod,5) = '11' THEN
                    valueReplacer = recorddata.productivityvalue11;
                WHEN substring(isoperiod,5) = '12' THEN
                    valueReplacer = recorddata.productivityvalue12;
                ELSE

            END CASE;
            SELECT periodid INTO periodReplacer FROM _periodstructure WHERE iso = isoperiod;
            queryReplacer = REPLACE(upsertTemplate,'{de}',cast(recorddata.de2 as VARCHAR));
            queryReplacer = REPLACE(queryReplacer,'{co}',cast(recorddata.co2 as VARCHAR));
            queryReplacer = REPLACE(queryReplacer,'{ou}',cast(recorddata.ou as VARCHAR));
            queryReplacer = REPLACE(queryReplacer,'{pe}',cast(periodReplacer as VARCHAR));
            queryReplacer = REPLACE(queryReplacer,'{value}',valueReplacer);
            queryString = concat(queryString, queryReplacer);

            --RAISE NOTICE 'INSERT QUERY: %', queryString;
        END LOOP;
        EXECUTE queryString;
    END LOOP;

	EXCEPTION WHEN OTHERS THEN
		GET STACKED DIAGNOSTICS _c = PG_EXCEPTION_CONTEXT;
		RAISE NOTICE 'String Query: %',queryString;
		raise notice '% %', SQLERRM, SQLSTATE;
		results := 'Error';
	END;
	RETURN results;

END;
$$
LANGUAGE plpgsql;
/*
 call delete function by pass orgunit id  text, text, text,MMhip91li8h text,iLKwCl3Od9c text,rqlTarZRu8L text,koixPT9d3Sr text,FzlzchJ2J7S
*/
--SELECT convertCummulative(2017);
--SELECT convertCummulative(2017,'FwpCBGQvYdL','BktmzfgqCjX','ngDrfoi85Oy','BktmzfgqCjX');

SELECT convertCummulative(2017,'FwpCBGQvYdL','BktmzfgqCjX','ngDrfoi85Oy','BktmzfgqCjX');

SELECT convertCummulative(2017,'FwpCBGQvYdL','Z0LtVda8wAo','ngDrfoi85Oy','Z0LtVda8wAo');
SELECT convertCummulative(2017,'FwpCBGQvYdL','J6W3kbELkGw','ngDrfoi85Oy','J6W3kbELkGw');
SELECT convertCummulative(2017,'FwpCBGQvYdL','mlpia7QBdqY','ngDrfoi85Oy','mlpia7QBdqY');
SELECT convertCummulative(2017,'FwpCBGQvYdL','oS2Oq1evsaK','ngDrfoi85Oy','oS2Oq1evsaK');
SELECT convertCummulative(2017,'FwpCBGQvYdL','bBKFyBvoo34','ngDrfoi85Oy','bBKFyBvoo34');

            SELECT convertCummulative(2017,'FwpCBGQvYdL','zSS1gwkIIu8','ngDrfoi85Oy','zSS1gwkIIu8');
SELECT convertCummulative(2017,'sS5OudDzXC2','ql8bSsHEnUN','FyJxMp5u7WP','ql8bSsHEnUN');
SELECT convertCummulative(2017,'sS5OudDzXC2','pcsiYqIW4kJ','FyJxMp5u7WP','pcsiYqIW4kJ');
SELECT convertCummulative(2017,'sS5OudDzXC2','YwRiKDxpYON','FyJxMp5u7WP','YwRiKDxpYON');
SELECT convertCummulative(2017,'sS5OudDzXC2','YkeweM90DZt','FyJxMp5u7WP','YkeweM90DZt');
SELECT convertCummulative(2017,'sS5OudDzXC2','pjXHRQQXIhg','FyJxMp5u7WP','pjXHRQQXIhg');

            SELECT convertCummulative(2017,'mVwNk3foz3v','hRHZBt0hok2','cf9SaENrA27','hRHZBt0hok2');
SELECT convertCummulative(2017,'mVwNk3foz3v','r5YXWoMvsX4','cf9SaENrA27','r5YXWoMvsX4');
SELECT convertCummulative(2017,'mVwNk3foz3v','g8e3yoakYec','cf9SaENrA27','g8e3yoakYec');
SELECT convertCummulative(2017,'mVwNk3foz3v','nxSBayfWRix','cf9SaENrA27','nxSBayfWRix');
SELECT convertCummulative(2017,'mVwNk3foz3v','CL9bLTJRESL','cf9SaENrA27','CL9bLTJRESL');
SELECT convertCummulative(2017,'mVwNk3foz3v','JnGowCNPR09','cf9SaENrA27','JnGowCNPR09');

            SELECT convertCummulative(2017,'mVwNk3foz3v','nxsGR3eo7aj','cf9SaENrA27','nxsGR3eo7aj');
SELECT convertCummulative(2017,'mVwNk3foz3v','syxO1e4huIX','cf9SaENrA27','syxO1e4huIX');
SELECT convertCummulative(2017,'mVwNk3foz3v','bkfyCurKXWV','cf9SaENrA27','bkfyCurKXWV');
SELECT convertCummulative(2017,'mVwNk3foz3v','ystqt8VT4Tp','cf9SaENrA27','ystqt8VT4Tp');
SELECT convertCummulative(2017,'mVwNk3foz3v','WpsmWKDTfdX','cf9SaENrA27','WpsmWKDTfdX');
SELECT convertCummulative(2017,'mVwNk3foz3v','D116dzscO4G','cf9SaENrA27','D116dzscO4G');

            SELECT convertCummulative(2017,'gbvUDbZWxUS','wJIxAhejWKY','dozTSGrBvVj','wJIxAhejWKY');
SELECT convertCummulative(2017,'gbvUDbZWxUS','R5DIMqSCTA5','dozTSGrBvVj','R5DIMqSCTA5');
SELECT convertCummulative(2017,'gbvUDbZWxUS','xCnCQxpSTUJ','dozTSGrBvVj','xCnCQxpSTUJ');
SELECT convertCummulative(2017,'gbvUDbZWxUS','iBa5lgXgvwk','dozTSGrBvVj','iBa5lgXgvwk');
SELECT convertCummulative(2017,'gbvUDbZWxUS','v3Eq35RuqEA','dozTSGrBvVj','v3Eq35RuqEA');
SELECT convertCummulative(2017,'gbvUDbZWxUS','bltcOiiZeO5','dozTSGrBvVj','bltcOiiZeO5');

            SELECT convertCummulative(2017,'gbvUDbZWxUS','uMeEFdAzqKS','dozTSGrBvVj','uMeEFdAzqKS');
SELECT convertCummulative(2017,'gbvUDbZWxUS','AqholFtHhlg','dozTSGrBvVj','AqholFtHhlg');
SELECT convertCummulative(2017,'rBstKKNXmYA','jjfebeJ6pbV','QnFeukGopwx','jjfebeJ6pbV');
SELECT convertCummulative(2017,'rBstKKNXmYA','BYTuIQ47dnS','QnFeukGopwx','BYTuIQ47dnS');
SELECT convertCummulative(2017,'rBstKKNXmYA','lJ9Cv8ISZRT','QnFeukGopwx','lJ9Cv8ISZRT');
SELECT convertCummulative(2017,'rBstKKNXmYA','xLi4aE2hf45','QnFeukGopwx','xLi4aE2hf45');

            SELECT convertCummulative(2017,'rBstKKNXmYA','eHhQeZB29hz','QnFeukGopwx','eHhQeZB29hz');
SELECT convertCummulative(2017,'rBstKKNXmYA','b5D4IKJFDJH','QnFeukGopwx','b5D4IKJFDJH');
SELECT convertCummulative(2017,'rBstKKNXmYA','vXOb5h9Rxqs','QnFeukGopwx','vXOb5h9Rxqs');
SELECT convertCummulative(2017,'rBstKKNXmYA','OEoQ7kif63L','QnFeukGopwx','OEoQ7kif63L');
SELECT convertCummulative(2017,'bJ84f27rqDB','MT4SwuoV2pQ','qRvbTVEmI6C','MT4SwuoV2pQ');
SELECT convertCummulative(2017,'bJ84f27rqDB','Y1zhvDQTe5e','qRvbTVEmI6C','Y1zhvDQTe5e');

            SELECT convertCummulative(2017,'bJ84f27rqDB','Efwc5ipDSTk','qRvbTVEmI6C','Efwc5ipDSTk');
SELECT convertCummulative(2017,'bJ84f27rqDB','WAl6t24Jpzt','qRvbTVEmI6C','WAl6t24Jpzt');
SELECT convertCummulative(2017,'bJ84f27rqDB','uQqzzomp9tc','qRvbTVEmI6C','uQqzzomp9tc');
SELECT convertCummulative(2017,'bJ84f27rqDB','ICiTJsU1Vec','qRvbTVEmI6C','ICiTJsU1Vec');
SELECT convertCummulative(2017,'bJ84f27rqDB','TZJQRkPRJm4','qRvbTVEmI6C','TZJQRkPRJm4');
SELECT convertCummulative(2017,'bJ84f27rqDB','jC7AWcjBkJ3','qRvbTVEmI6C','jC7AWcjBkJ3');

            SELECT convertCummulative(2017,'bJ84f27rqDB','BPGkOcPjPS7','qRvbTVEmI6C','BPGkOcPjPS7');
SELECT convertCummulative(2017,'bJ84f27rqDB','nMMaTQxdPJG','qRvbTVEmI6C','nMMaTQxdPJG');
SELECT convertCummulative(2017,'bJ84f27rqDB','HdPaWqoDpdZ','qRvbTVEmI6C','HdPaWqoDpdZ');
SELECT convertCummulative(2017,'YSRj2rXWC0f','tPbRcvnWxkS','xpXXurlwbNM','tPbRcvnWxkS');
SELECT convertCummulative(2017,'YSRj2rXWC0f','fXZ1QJJJ9wp','xpXXurlwbNM','fXZ1QJJJ9wp');
SELECT convertCummulative(2017,'YSRj2rXWC0f','Z4bVJVRPKjl','xpXXurlwbNM','Z4bVJVRPKjl');

            SELECT convertCummulative(2017,'YSRj2rXWC0f','pAB6StXtLU8','xpXXurlwbNM','pAB6StXtLU8');
SELECT convertCummulative(2017,'YSRj2rXWC0f','BEi0yw6WwBa','xpXXurlwbNM','BEi0yw6WwBa');
SELECT convertCummulative(2017,'YSRj2rXWC0f','w30fA5rFeRV','xpXXurlwbNM','w30fA5rFeRV');
SELECT convertCummulative(2017,'YSRj2rXWC0f','Bkz2vXNsYke','xpXXurlwbNM','Bkz2vXNsYke');
SELECT convertCummulative(2017,'YSRj2rXWC0f','Heme7D8HT30','xpXXurlwbNM','Heme7D8HT30');
SELECT convertCummulative(2017,'YSRj2rXWC0f','VIPqyvWbwDU','xpXXurlwbNM','VIPqyvWbwDU');

            SELECT convertCummulative(2017,'YSRj2rXWC0f','dUIkQFWg2qm','xpXXurlwbNM','dUIkQFWg2qm');
SELECT convertCummulative(2017,'YSRj2rXWC0f','H9p6YVxG7zJ','xpXXurlwbNM','H9p6YVxG7zJ');
SELECT convertCummulative(2017,'YSRj2rXWC0f','JIeF7OCEt6D','xpXXurlwbNM','JIeF7OCEt6D');
SELECT convertCummulative(2017,'YSRj2rXWC0f','bSNT1r88kIC','xpXXurlwbNM','bSNT1r88kIC');
SELECT convertCummulative(2017,'YSRj2rXWC0f','i9b5kFnGOkF','xpXXurlwbNM','i9b5kFnGOkF');
SELECT convertCummulative(2017,'YSRj2rXWC0f','hkdaOo9ZpB2','xpXXurlwbNM','hkdaOo9ZpB2');

            SELECT convertCummulative(2017,'YSRj2rXWC0f','rwsWnkaJ5HR','xpXXurlwbNM','rwsWnkaJ5HR');
SELECT convertCummulative(2017,'YSRj2rXWC0f','wTlpU2TaHiz','xpXXurlwbNM','wTlpU2TaHiz');
SELECT convertCummulative(2017,'YSRj2rXWC0f','a4OM9bKggAT','xpXXurlwbNM','a4OM9bKggAT');
SELECT convertCummulative(2017,'WoUIOUcej6W','fuzYIcfLZN2','lcdIDgumilv','fuzYIcfLZN2');
SELECT convertCummulative(2017,'WoUIOUcej6W','HquzVesvM2Z','lcdIDgumilv','HquzVesvM2Z');
SELECT convertCummulative(2017,'WoUIOUcej6W','BJuZMglWlTz','lcdIDgumilv','BJuZMglWlTz');

            SELECT convertCummulative(2017,'WoUIOUcej6W','GmO6g98S4G9','lcdIDgumilv','GmO6g98S4G9');
SELECT convertCummulative(2017,'WoUIOUcej6W','wfxDF7iGY3f','lcdIDgumilv','wfxDF7iGY3f');
SELECT convertCummulative(2017,'WoUIOUcej6W','QlQ95KGkgR6','lcdIDgumilv','QlQ95KGkgR6');
SELECT convertCummulative(2017,'WoUIOUcej6W','nrQIoh49aGU','lcdIDgumilv','nrQIoh49aGU');
SELECT convertCummulative(2017,'WoUIOUcej6W','ZbmI2XtXHIS','lcdIDgumilv','ZbmI2XtXHIS');
SELECT convertCummulative(2017,'WoUIOUcej6W','dUwc6pkKgmM','lcdIDgumilv','dUwc6pkKgmM');

            SELECT convertCummulative(2017,'WoUIOUcej6W','drXDRIxLVzv','lcdIDgumilv','drXDRIxLVzv');
SELECT convertCummulative(2017,'WoUIOUcej6W','dqChjQjl0ZH','lcdIDgumilv','dqChjQjl0ZH');
SELECT convertCummulative(2017,'WoUIOUcej6W','oplxxXgoehP','lcdIDgumilv','oplxxXgoehP');
SELECT convertCummulative(2017,'WoUIOUcej6W','SyDcaTOW0JP','lcdIDgumilv','SyDcaTOW0JP');
SELECT convertCummulative(2017,'WoUIOUcej6W','XckkuoyUldR','lcdIDgumilv','XckkuoyUldR');
SELECT convertCummulative(2017,'WoUIOUcej6W','GtUrKU93piR','lcdIDgumilv','GtUrKU93piR');

            SELECT convertCummulative(2017,'WoUIOUcej6W','Hmz6lySVDCN','lcdIDgumilv','Hmz6lySVDCN');
SELECT convertCummulative(2017,'WoUIOUcej6W','QDSfLpYNZ3l','lcdIDgumilv','QDSfLpYNZ3l');
SELECT convertCummulative(2017,'nc1E1TyiGhG','zPf9YtxdJJH','rNaeaP69Ml0','zPf9YtxdJJH');
SELECT convertCummulative(2017,'nc1E1TyiGhG','D4phPJP6u9V','rNaeaP69Ml0','D4phPJP6u9V');
SELECT convertCummulative(2017,'nc1E1TyiGhG','MvHtsSwbho2','rNaeaP69Ml0','MvHtsSwbho2');
SELECT convertCummulative(2017,'nc1E1TyiGhG','e27Rj8LSYQV','rNaeaP69Ml0','e27Rj8LSYQV');

            SELECT convertCummulative(2017,'nc1E1TyiGhG','pq1B5YRvk3w','rNaeaP69Ml0','pq1B5YRvk3w');
SELECT convertCummulative(2017,'nc1E1TyiGhG','hOj19H7Vodn','rNaeaP69Ml0','hOj19H7Vodn');
SELECT convertCummulative(2017,'nc1E1TyiGhG','mQjKnpOz1I8','rNaeaP69Ml0','mQjKnpOz1I8');
SELECT convertCummulative(2017,'uNGeyGIsN7W','deTgGupUgr3','SXvP3NECeFk','deTgGupUgr3');

--PGPASSWORD=postgres psql -U postgres -h localhost -d ards -a -f src/sql/conversion.sql
--PGPASSWORD=postgres psql -U postgres -h localhost -d ards229_ardsmigration -a -f conversion.sql
--'SXvP3NECeFk-deTgGupUgr3','dozTSGrBvVj-wJIxAhejWKY'
-- rsync -av -e 'ssh -p 9037' --progress /opt/ards/config/apps/standardreport/src/sql/conversion.sql vincentminde@hisptz.org:/home/vincentminde
