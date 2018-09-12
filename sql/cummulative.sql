DROP FUNCTION convertCummulative(INTEGER);
CREATE OR REPLACE FUNCTION convertCummulative(year INTEGER) RETURNS VARCHAR AS $$
DECLARE
	_c text;
	results VARCHAR;
	isoperiod VARCHAR;
	pisoperiod VARCHAR;
	previousvalue VARCHAR;
	recorddata RECORD;
BEGIN
	BEGIN

    FOREACH isoperiod IN array string_to_array(year + 1||'06,' || year + 1|| '05,'|| year+1 || '04,'|| year+1 || '03,'|| year+1 || '02,'|| year +1 || '01,'|| year || '12,'|| year || '11,'|| year || '10,'|| year || '09,'|| year || '08,'|| year || '07,', ',') LOOP
        --pisoperiod = substring(isoperiod,0,5);
        IF substring(isoperiod,5) != '' THEN
            pisoperiod = cast(cast(isoperiod as integer) - 1 as VARCHAR);
            IF substring(isoperiod,5) = '01' THEN
              pisoperiod = cast(cast(substring(isoperiod,0,5) as integer) - 1 as VARCHAR) || '12';
            END IF;
            FOR recorddata IN SELECT *
                FROM datavalue dv
                INNER JOIN _periodstructure _ps ON(_ps.periodid = dv.periodid AND _ps.iso = isoperiod)
                INNER JOIN dataelement de USING(dataelementid)
                INNER JOIN categoryoptioncombo co USING(categoryoptioncomboid)
                WHERE de.uid || '-' || co.uid IN ('FwpCBGQvYdL-BktmzfgqCjX','FwpCBGQvYdL-Z0LtVda8wAo') -- All cummulative dataelements
            LOOP
                SELECT value INTO previousvalue FROM datavalue dv
                WHERE recorddata.dataelementid = dv.dataelementid AND
                    recorddata.periodid = dv.periodid AND
                    recorddata.sourceid = dv.sourceid AND
                    recorddata.categoryoptioncomboid = dv.categoryoptioncomboid AND
                    recorddata.attributeoptioncomboid = dv.attributeoptioncomboid AND
                    dv.periodid = (SELECT periodid FROM _periodstructure WHERE iso = pisoperiod);
                IF previousvalue is null THEN
                  previousvalue = '0';
                END IF;
                UPDATE datavalue dv SET value = cast(cast(recorddata.value as integer) - cast(previousvalue as integer) as VARCHAR)
                WHERE recorddata.dataelementid = dv.dataelementid AND
                    recorddata.periodid = dv.periodid AND
                    recorddata.sourceid = dv.sourceid AND
                    recorddata.categoryoptioncomboid = dv.categoryoptioncomboid AND
                    recorddata.attributeoptioncomboid = dv.attributeoptioncomboid AND
                    dv.periodid = (SELECT periodid FROM _periodstructure WHERE iso = isoperiod);
                 raise notice 'Value:%', recorddata.value;
            END LOOP;
            --raise notice '%:%', pisoperiod, isoperiod;
        END IF;
    END LOOP;


	EXCEPTION WHEN OTHERS THEN
		GET STACKED DIAGNOSTICS _c = PG_EXCEPTION_CONTEXT;
		RAISE NOTICE 'context: >>%<<', _c;
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
--SELECT convertCummulative(2016);

--PGPASSWORD=postgres psql -U postgres -h localhost -d ards -a -f src/sql/cummulative.sql

