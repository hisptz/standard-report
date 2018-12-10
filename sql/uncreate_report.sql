DROP FUNCTION uncreate_report(dsId VARCHAR, dsDependId VARCHAR,ouId VARCHAR, peId VARCHAR);
CREATE OR REPLACE FUNCTION uncreate_report(dsId VARCHAR,dsDependId VARCHAR, ouId VARCHAR, peId VARCHAR) RETURNS bigint AS $$
DECLARE
	_c text;
	year INTEGER;
	results VARCHAR;
	isoperiod VARCHAR;
	selectedperiod VARCHAR;
BEGIN
    IF dsId = 'cSC1VV8uMh9' THEN
        selectedperiod = peId;
        SELECT cast(SUBSTRING(peId,1,4) as integer) INTO year;
        IF (SELECT cast(SUBSTRING(peId,5,2) as integer) < 7) THEN
            FOREACH isoperiod IN array string_to_array(year ||'06,' || year || '05,'|| year || '04,'|| year || '03,'|| year || '02,'|| year || '01', ',') LOOP
                IF isoperiod = peId THEN
                    EXIT;
                END IF;
                selectedperiod = selectedperiod || '-' || isoperiod;
            END LOOP;
        ELSE
            FOREACH isoperiod IN array string_to_array(year + 1||'06,' || year + 1|| '05,'|| year+1 || '04,'|| year+1 || '03,'|| year+1 || '02,'|| year +1 || '01,'|| year || '12,'|| year || '11,'|| year || '10,'|| year || '09,'|| year || '08,', ',') LOOP
                IF isoperiod = peId THEN
                    EXIT;
                END IF;
                selectedperiod = selectedperiod || '-' || isoperiod;
            END LOOP;
        END IF;
    ELSE
        selectedperiod = peId;
    END IF;

    raise notice '% % %', dsId, dsDependId, selectedperiod;
    WITH a AS (DELETE FROM keyjsonvalue WHERE keyjsonvalueid IN (SELECT keyjsonvalueid FROM (SELECT k.keyjsonvalueid, split_part(k.namespacekey,'_',1) ds,split_part(k.namespacekey,'_',2) ou,split_part(k.namespacekey,'_',3) pe FROM keyjsonvalue k
        WHERE namespace = 'executed') as executed
        WHERE executed.ou IN (SELECT unnest(string_to_array(SUBSTRING(path,2), '/')) FROM organisationunit WHERE uid = ouId)
        AND executed.pe IN (SELECT unnest(string_to_array(
            (CASE WHEN monthly IS NOT NULL THEN monthly || '/' ELSE '' END)
            ||  (CASE WHEN quarterly IS NOT NULL THEN quarterly || '/' ELSE '' END)
            ||financialjuly, '/')) FROM _periodstructure WHERE iso IN (SELECT unnest(string_to_array(selectedperiod, '-'))))
        AND executed.ds IN (SELECT unnest(string_to_array(dsId || '-' || dsDependId, '-'))))  RETURNING 1)
    SELECT COUNT(*) INTO results FROM a;
    RETURN results;
END;
$$
LANGUAGE plpgsql;
/*
 call delete function by pass orgunit id  text, text, text,MMhip91li8h text,iLKwCl3Od9c text,rqlTarZRu8L text,koixPT9d3Sr text,FzlzchJ2J7S
*/
--SELECT convertCummulative(2017);

--PGPASSWORD=postgres psql -U postgres -h localhost -d ards -a -f /opt/ards/config/apps/standardreport/src/sql/uncreate_report.sql

--'SXvP3NECeFk-deTgGupUgr3','dozTSGrBvVj-wJIxAhejWKY'
SELECT * FROM uncreate_report('cSC1VV8uMh9','QLoyT2aHGes-oRJJ4PtC7M8-cSC1VV8uMh9', 'lRMxINGnEKt', '201701');
