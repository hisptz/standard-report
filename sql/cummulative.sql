DROP FUNCTION convertCummulative(INTEGER);
CREATE OR REPLACE FUNCTION convertCummulative(year INTEGER) RETURNS VARCHAR AS $$
DECLARE
	_c text;
	results VARCHAR;
	isoperiod VARCHAR;
	pisoperiod VARCHAR;
	previouspandwavalue VARCHAR;
	currentpandwavalue VARCHAR;
	pandwavalue VARCHAR;
	previousuzalishajivalue VARCHAR;
	currentuzalishajivalue VARCHAR;
	uzalishajivalue VARCHAR;
	recorddata RECORD;
BEGIN
	BEGIN
	CREATE TABLE tempdataelements(
    id        varchar(5) CONSTRAINT firstkey PRIMARY KEY,
    de1       char(11) NOT NULL,
    co1       char(11) NOT NULL,
    de2       char(11) NOT NULL,
    co2       char(11) NOT NULL
);
INSERT INTO tempdataelements (id, de1, co1, de2, co2)
VALUES  ('1','FwpCBGQvYdL','BktmzfgqCjX','ngDrfoi85Oy','BktmzfgqCjX'),('2','FwpCBGQvYdL','Z0LtVda8wAo','ngDrfoi85Oy','Z0LtVda8wAo'),('3','FwpCBGQvYdL','J6W3kbELkGw','ngDrfoi85Oy','J6W3kbELkGw'),('4','FwpCBGQvYdL','mlpia7QBdqY','ngDrfoi85Oy','mlpia7QBdqY'),('5','FwpCBGQvYdL','oS2Oq1evsaK','ngDrfoi85Oy','oS2Oq1evsaK'),('6','FwpCBGQvYdL','bBKFyBvoo34','ngDrfoi85Oy','bBKFyBvoo34'),('7','FwpCBGQvYdL','zSS1gwkIIu8','ngDrfoi85Oy','zSS1gwkIIu8'),('8','sS5OudDzXC2','ql8bSsHEnUN','FyJxMp5u7WP','ql8bSsHEnUN'),('9','sS5OudDzXC2','pcsiYqIW4kJ','FyJxMp5u7WP','pcsiYqIW4kJ'),('10','sS5OudDzXC2','YwRiKDxpYON','FyJxMp5u7WP','YwRiKDxpYON'),('11','sS5OudDzXC2','YkeweM90DZt','FyJxMp5u7WP','YkeweM90DZt'),('12','sS5OudDzXC2','pjXHRQQXIhg','FyJxMp5u7WP','pjXHRQQXIhg'),('13','mVwNk3foz3v','hRHZBt0hok2','cf9SaENrA27','hRHZBt0hok2'),('14','mVwNk3foz3v','r5YXWoMvsX4','cf9SaENrA27','r5YXWoMvsX4'),('15','mVwNk3foz3v','g8e3yoakYec','cf9SaENrA27','g8e3yoakYec'),('16','mVwNk3foz3v','nxSBayfWRix','cf9SaENrA27','nxSBayfWRix'),('17','mVwNk3foz3v','CL9bLTJRESL','cf9SaENrA27','CL9bLTJRESL'),('18','mVwNk3foz3v','JnGowCNPR09','cf9SaENrA27','JnGowCNPR09'),('19','mVwNk3foz3v','nxsGR3eo7aj','cf9SaENrA27','nxsGR3eo7aj'),('20','mVwNk3foz3v','syxO1e4huIX','cf9SaENrA27','syxO1e4huIX'),('21','mVwNk3foz3v','bkfyCurKXWV','cf9SaENrA27','bkfyCurKXWV'),('22','mVwNk3foz3v','ystqt8VT4Tp','cf9SaENrA27','ystqt8VT4Tp'),('23','mVwNk3foz3v','WpsmWKDTfdX','cf9SaENrA27','WpsmWKDTfdX'),('24','mVwNk3foz3v','D116dzscO4G','cf9SaENrA27','D116dzscO4G'),('25','gbvUDbZWxUS','wJIxAhejWKY','dozTSGrBvVj','wJIxAhejWKY'),('26','gbvUDbZWxUS','R5DIMqSCTA5','dozTSGrBvVj','R5DIMqSCTA5'),('27','gbvUDbZWxUS','xCnCQxpSTUJ','dozTSGrBvVj','xCnCQxpSTUJ'),('28','gbvUDbZWxUS','iBa5lgXgvwk','dozTSGrBvVj','iBa5lgXgvwk'),('29','gbvUDbZWxUS','v3Eq35RuqEA','dozTSGrBvVj','v3Eq35RuqEA'),('30','gbvUDbZWxUS','bltcOiiZeO5','dozTSGrBvVj','bltcOiiZeO5'),('31','gbvUDbZWxUS','uMeEFdAzqKS','dozTSGrBvVj','uMeEFdAzqKS'),('32','gbvUDbZWxUS','AqholFtHhlg','dozTSGrBvVj','AqholFtHhlg'),('33','rBstKKNXmYA','jjfebeJ6pbV','QnFeukGopwx','jjfebeJ6pbV'),('34','rBstKKNXmYA','BYTuIQ47dnS','QnFeukGopwx','BYTuIQ47dnS'),('35','rBstKKNXmYA','lJ9Cv8ISZRT','QnFeukGopwx','lJ9Cv8ISZRT'),('36','rBstKKNXmYA','xLi4aE2hf45','QnFeukGopwx','xLi4aE2hf45'),('37','rBstKKNXmYA','eHhQeZB29hz','QnFeukGopwx','eHhQeZB29hz'),('38','rBstKKNXmYA','b5D4IKJFDJH','QnFeukGopwx','b5D4IKJFDJH'),('39','rBstKKNXmYA','vXOb5h9Rxqs','QnFeukGopwx','vXOb5h9Rxqs'),('40','rBstKKNXmYA','OEoQ7kif63L','QnFeukGopwx','OEoQ7kif63L'),('41','bJ84f27rqDB','MT4SwuoV2pQ','qRvbTVEmI6C','MT4SwuoV2pQ'),('42','bJ84f27rqDB','Y1zhvDQTe5e','qRvbTVEmI6C','Y1zhvDQTe5e'),('43','bJ84f27rqDB','Efwc5ipDSTk','qRvbTVEmI6C','Efwc5ipDSTk'),('44','bJ84f27rqDB','WAl6t24Jpzt','qRvbTVEmI6C','WAl6t24Jpzt'),('45','bJ84f27rqDB','uQqzzomp9tc','qRvbTVEmI6C','uQqzzomp9tc'),('46','bJ84f27rqDB','ICiTJsU1Vec','qRvbTVEmI6C','ICiTJsU1Vec'),('47','bJ84f27rqDB','TZJQRkPRJm4','qRvbTVEmI6C','TZJQRkPRJm4'),('48','bJ84f27rqDB','jC7AWcjBkJ3','qRvbTVEmI6C','jC7AWcjBkJ3'),('49','bJ84f27rqDB','BPGkOcPjPS7','qRvbTVEmI6C','BPGkOcPjPS7'),('50','bJ84f27rqDB','nMMaTQxdPJG','qRvbTVEmI6C','nMMaTQxdPJG'),('51','bJ84f27rqDB','HdPaWqoDpdZ','qRvbTVEmI6C','HdPaWqoDpdZ'),('52','YSRj2rXWC0f','tPbRcvnWxkS','xpXXurlwbNM','tPbRcvnWxkS'),('53','YSRj2rXWC0f','fXZ1QJJJ9wp','xpXXurlwbNM','fXZ1QJJJ9wp'),('54','YSRj2rXWC0f','Z4bVJVRPKjl','xpXXurlwbNM','Z4bVJVRPKjl'),('55','YSRj2rXWC0f','pAB6StXtLU8','xpXXurlwbNM','pAB6StXtLU8'),('56','YSRj2rXWC0f','BEi0yw6WwBa','xpXXurlwbNM','BEi0yw6WwBa'),('57','YSRj2rXWC0f','w30fA5rFeRV','xpXXurlwbNM','w30fA5rFeRV'),('58','YSRj2rXWC0f','Bkz2vXNsYke','xpXXurlwbNM','Bkz2vXNsYke'),('59','YSRj2rXWC0f','Heme7D8HT30','xpXXurlwbNM','Heme7D8HT30'),('60','YSRj2rXWC0f','VIPqyvWbwDU','xpXXurlwbNM','VIPqyvWbwDU'),('61','YSRj2rXWC0f','dUIkQFWg2qm','xpXXurlwbNM','dUIkQFWg2qm'),('62','YSRj2rXWC0f','H9p6YVxG7zJ','xpXXurlwbNM','H9p6YVxG7zJ'),('63','YSRj2rXWC0f','JIeF7OCEt6D','xpXXurlwbNM','JIeF7OCEt6D'),('64','YSRj2rXWC0f','bSNT1r88kIC','xpXXurlwbNM','bSNT1r88kIC'),('65','YSRj2rXWC0f','i9b5kFnGOkF','xpXXurlwbNM','i9b5kFnGOkF'),('66','YSRj2rXWC0f','hkdaOo9ZpB2','xpXXurlwbNM','hkdaOo9ZpB2'),('67','YSRj2rXWC0f','rwsWnkaJ5HR','xpXXurlwbNM','rwsWnkaJ5HR'),('68','YSRj2rXWC0f','wTlpU2TaHiz','xpXXurlwbNM','wTlpU2TaHiz'),('69','YSRj2rXWC0f','a4OM9bKggAT','xpXXurlwbNM','a4OM9bKggAT'),('70','WoUIOUcej6W','fuzYIcfLZN2','lcdIDgumilv','fuzYIcfLZN2'),('71','WoUIOUcej6W','HquzVesvM2Z','lcdIDgumilv','HquzVesvM2Z'),('72','WoUIOUcej6W','BJuZMglWlTz','lcdIDgumilv','BJuZMglWlTz'),('73','WoUIOUcej6W','GmO6g98S4G9','lcdIDgumilv','GmO6g98S4G9'),('74','WoUIOUcej6W','wfxDF7iGY3f','lcdIDgumilv','wfxDF7iGY3f'),('75','WoUIOUcej6W','QlQ95KGkgR6','lcdIDgumilv','QlQ95KGkgR6'),('76','WoUIOUcej6W','nrQIoh49aGU','lcdIDgumilv','nrQIoh49aGU'),('77','WoUIOUcej6W','ZbmI2XtXHIS','lcdIDgumilv','ZbmI2XtXHIS'),('78','WoUIOUcej6W','dUwc6pkKgmM','lcdIDgumilv','dUwc6pkKgmM'),('79','WoUIOUcej6W','drXDRIxLVzv','lcdIDgumilv','drXDRIxLVzv'),('80','WoUIOUcej6W','dqChjQjl0ZH','lcdIDgumilv','dqChjQjl0ZH'),('81','WoUIOUcej6W','oplxxXgoehP','lcdIDgumilv','oplxxXgoehP'),('82','WoUIOUcej6W','SyDcaTOW0JP','lcdIDgumilv','SyDcaTOW0JP'),('83','WoUIOUcej6W','XckkuoyUldR','lcdIDgumilv','XckkuoyUldR'),('84','WoUIOUcej6W','GtUrKU93piR','lcdIDgumilv','GtUrKU93piR'),('85','WoUIOUcej6W','Hmz6lySVDCN','lcdIDgumilv','Hmz6lySVDCN'),('86','WoUIOUcej6W','QDSfLpYNZ3l','lcdIDgumilv','QDSfLpYNZ3l'),('87','nc1E1TyiGhG','zPf9YtxdJJH','rNaeaP69Ml0','zPf9YtxdJJH'),('88','nc1E1TyiGhG','D4phPJP6u9V','rNaeaP69Ml0','D4phPJP6u9V'),('89','nc1E1TyiGhG','MvHtsSwbho2','rNaeaP69Ml0','MvHtsSwbho2'),('90','nc1E1TyiGhG','e27Rj8LSYQV','rNaeaP69Ml0','e27Rj8LSYQV'),('91','nc1E1TyiGhG','pq1B5YRvk3w','rNaeaP69Ml0','pq1B5YRvk3w'),('92','nc1E1TyiGhG','hOj19H7Vodn','rNaeaP69Ml0','hOj19H7Vodn'),('93','nc1E1TyiGhG','mQjKnpOz1I8','rNaeaP69Ml0','mQjKnpOz1I8'),('94','uNGeyGIsN7W','deTgGupUgr3','SXvP3NECeFk','deTgGupUgr3');

    FOREACH isoperiod IN array string_to_array(year + 1||'06,' || year + 1|| '05,'|| year+1 || '04,'|| year+1 || '03,'|| year+1 || '02,'|| year +1 || '01,'|| year || '12,'|| year || '11,'|| year || '10,'|| year || '09,'|| year || '08,', ',') LOOP
    --FOREACH isoperiod IN array string_to_array(year || '08,', ',') LOOP
        --pisoperiod = substring(isoperiod,0,5);
        IF substring(isoperiod,5) != '' THEN
            pisoperiod = cast(cast(isoperiod as integer) - 1 as VARCHAR);
            IF substring(isoperiod,5) = '01' THEN
              pisoperiod = cast(cast(substring(isoperiod,0,5) as integer) - 1 as VARCHAR) || '12';
            END IF;
            FOR recorddata IN SELECT de1.dataelementid as de1,co1.categoryoptioncomboid as co1,de2.dataelementid as de2,
					co2.categoryoptioncomboid as co2, ou.organisationunitid, ou.uid,
					aoc.categoryoptioncomboid as attributeoptioncomboid,
					dv.value as pandwa, dv2.value as uzalishaji, _ps.iso,_ps.periodid
				FROM tempdataelements tmp
				INNER JOIN dataelement de1 ON(de1.uid = tmp.de1)
				INNER JOIN dataelement de2 ON(de2.uid = tmp.de2)
				INNER JOIN categoryoptioncombo co1 ON(co1.uid = tmp.co1)
				INNER JOIN categoryoptioncombo co2  ON(co2.uid = tmp.co2)
				INNER JOIN _periodstructure _ps ON(_ps.iso = isoperiod )
				LEFT JOIN categoryoptioncombo aoc ON(aoc.categoryoptioncomboid = 339884 OR aoc.categoryoptioncomboid = 15 OR aoc.categoryoptioncomboid = 339885)
				LEFT JOIN organisationunit ou ON(ou.hierarchylevel = 4)-- AND ou.path like '%iPOwn2LlQ2e%')
				LEFT JOIN datavalue dv ON(ou.organisationunitid = dv.sourceid AND de1.dataelementid= dv.dataelementid AND co1.categoryoptioncomboid = dv.categoryoptioncomboid AND _ps.periodid = dv.periodid AND dv.attributeoptioncomboid = aoc.categoryoptioncomboid)
				LEFT JOIN datavalue dv2 ON(ou.organisationunitid = dv2.sourceid AND de2.dataelementid= dv2.dataelementid AND co2.categoryoptioncomboid = dv2.categoryoptioncomboid AND _ps.periodid = dv2.periodid AND dv2.attributeoptioncomboid = aoc.categoryoptioncomboid)

            LOOP
                SELECT value INTO previouspandwavalue FROM datavalue dv
                --INNER JOIN _periodstructure _ps ON(_ps.periodid = dv.periodid AND _ps.iso = pisoperiod)
                WHERE recorddata.de1 = dv.dataelementid AND
                    recorddata.organisationunitid = dv.sourceid AND
                    recorddata.co1 = dv.categoryoptioncomboid AND
                    recorddata.attributeoptioncomboid = dv.attributeoptioncomboid AND
                    dv.periodid = (SELECT periodid FROM _periodstructure _ps WHERE _ps.iso = pisoperiod);

                IF previouspandwavalue is null OR TRIM(previouspandwavalue) ='' THEN
                  previouspandwavalue = '0';
                END IF;
                currentpandwavalue = recorddata.pandwa;
                IF recorddata.pandwa is null OR TRIM(recorddata.pandwa) ='' THEN
                  currentpandwavalue = '0';
                END IF;
                pandwavalue = cast(cast(currentpandwavalue as double precision) - cast(previouspandwavalue as double precision) as VARCHAR);

                -- Update eneo lililopandwa
                INSERT INTO public.datavalue(
                        dataelementid, periodid, sourceid, categoryoptioncomboid, attributeoptioncomboid,
                        value, storedby, lastupdated, comment, created, deleted
                        )
                VALUES (
                        recorddata.de1, recorddata.periodid, recorddata.organisationunitid, recorddata.co1, recorddata.attributeoptioncomboid ,
                        pandwavalue, 'vincentminde', now(), '', now(), FALSE
                        )
                    ON CONFLICT ON CONSTRAINT datavalue_pkey
                    DO UPDATE SET value = pandwavalue
                    WHERE recorddata.de1 = datavalue.dataelementid AND
                        recorddata.periodid = datavalue.periodid AND
                        recorddata.organisationunitid = datavalue.sourceid AND
                        recorddata.co1 = datavalue.categoryoptioncomboid AND
                        recorddata.attributeoptioncomboid = datavalue.attributeoptioncomboid;

                SELECT value INTO previousuzalishajivalue FROM datavalue dv
                --INNER JOIN _periodstructure _ps ON(_ps.periodid = dv.periodid AND _ps.iso = pisoperiod)
                WHERE recorddata.de2 = dv.dataelementid AND
                    recorddata.organisationunitid = dv.sourceid AND
                    recorddata.co2 = dv.categoryoptioncomboid AND
                    recorddata.attributeoptioncomboid = dv.attributeoptioncomboid AND
                    dv.periodid = (SELECT periodid FROM _periodstructure _ps WHERE _ps.iso = pisoperiod);

                IF previousuzalishajivalue is null OR TRIM(previousuzalishajivalue) ='' THEN
                  previousuzalishajivalue = '0';
                END IF;
                currentuzalishajivalue = recorddata.uzalishaji;
                IF recorddata.uzalishaji is null OR TRIM(recorddata.uzalishaji) ='' THEN
                  currentuzalishajivalue = '0';
                END IF;
                uzalishajivalue = '0';
                IF pandwavalue <> '0' THEN
					uzalishajivalue = (cast(currentpandwavalue as double precision) * cast(currentuzalishajivalue as double precision));
					uzalishajivalue = cast(uzalishajivalue as double precision) - (cast(previouspandwavalue as double precision) * cast(previousuzalishajivalue as double precision));
					uzalishajivalue = cast(uzalishajivalue as double precision) / cast(pandwavalue as double precision);
					uzalishajivalue = cast(uzalishajivalue as double precision);

                END IF;
                IF recorddata.uid =  'Kppf2jzm265' AND isoperiod = '201708' THEN
					--raise notice 'Value %', uzalishajivalue;
                END IF;

                -- Update eneo uzalishaji tija
                INSERT INTO public.datavalue(
                        dataelementid, periodid, sourceid, categoryoptioncomboid, attributeoptioncomboid,
                        value, storedby, lastupdated, comment, created, deleted
                        )
                VALUES (
                        recorddata.de2, recorddata.periodid, recorddata.organisationunitid, recorddata.co2, recorddata.attributeoptioncomboid ,
                        uzalishajivalue, 'vincentminde', now(), '', now(), FALSE
                        )
                    ON CONFLICT ON CONSTRAINT datavalue_pkey
                    DO UPDATE SET value = uzalishajivalue
                    WHERE recorddata.de2 = datavalue.dataelementid AND
                        recorddata.periodid = datavalue.periodid AND
                        recorddata.organisationunitid = datavalue.sourceid AND
                        recorddata.co2 = datavalue.categoryoptioncomboid AND
                        recorddata.attributeoptioncomboid = datavalue.attributeoptioncomboid;
            END LOOP;
        END IF;
    END LOOP;

	EXCEPTION WHEN OTHERS THEN
		GET STACKED DIAGNOSTICS _c = PG_EXCEPTION_CONTEXT;
		RAISE NOTICE 'context: >>%<<', _c;
		raise notice '% %', SQLERRM, SQLSTATE;
		results := 'Error';
	END;
	DROP TABLE tempdataelements;
	RETURN results;

END;
$$
LANGUAGE plpgsql;
/*
 call delete function by pass orgunit id  text, text, text,MMhip91li8h text,iLKwCl3Od9c text,rqlTarZRu8L text,koixPT9d3Sr text,FzlzchJ2J7S
*/
--SELECT convertCummulative(2017);

--PGPASSWORD=postgres psql -U postgres -h localhost -d ards -a -f src/sql/cummulative.sql

--'SXvP3NECeFk-deTgGupUgr3','dozTSGrBvVj-wJIxAhejWKY'
