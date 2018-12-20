DROP FUNCTION create_report(dsId VARCHAR, dsDependId VARCHAR,ouId VARCHAR, peId VARCHAR);
CREATE OR REPLACE FUNCTION create_report(dsId VARCHAR,dsDependId VARCHAR, ouId VARCHAR, peId VARCHAR) RETURNS bigint AS $$
DECLARE
	_c text;
	year INTEGER;
	results VARCHAR;
	isoperiod VARCHAR;
	selectedperiod VARCHAR;
	recorddata RECORD;
	perioddata RECORD;
BEGIN
    FOR recorddata IN
        SELECT ou.uid ou,ds.uid dataset,ds.periodtypeid FROM organisationunit ou
        LEFT JOIN datasetsource dss ON(dss.sourceid = ou.organisationunitid)
        LEFT JOIN dataset ds ON(ds.datasetid = dss.datasetid)
        WHERE ou.path LIKE '%' || ouId || '%' AND ou.hierarchylevel = 3 AND ds.uid IN ('cSC1VV8uMh9','Znn30Q67yDO','OBnVfEenAuW')
    LOOP
        /*INSERT INTO keyjsonvalue(
	    keyjsonvalueid, uid, created, lastupdated, namespace, namespacekey, value, encrypted, lastupdatedby)
        SELECT * FROM (SELECT
                (SELECT max(keyjsonvalueid) FROM keyjsonvalue) + ROW_NUMBER() OVER(),
                uid(),
                now(),
                now(),
                'notExecuted',
                recorddata.dataset || '_' || recorddata.ou || '_' || ps.iso as namespaceid,
                '{}',
                FALSE,
                1
            FROM _periodstructure ps
            INNER JOIN period p USING(periodid)
            INNER JOIN periodtype pt USING(periodtypeid)
            WHERE (ps.financialjuly = peId OR ps.quarterly = peId OR ps.monthly = peId) AND recorddata.periodtypeid = p.periodtypeid) as keyjsondata
        WHERE keyjsondata.namespaceid NOT IN (SELECT namespacekey FROM keyjsonvalue WHERE namespace IN ('executed','notExecuted'));*/

        IF recorddata.dataset = 'cSC1VV8uMh9' THEN
            selectedperiod = '';
            SELECT cast(SUBSTRING(peId,1,4) as integer) INTO year;
            IF (SELECT SUBSTRING(peId,5,4) = 'July') THEN
                selectedperiod = year + 1||'06-' || year + 1|| '05-'|| year+1 || '04-'|| year+1 || '03-'|| year+1 || '02-'|| year +1 || '01-'|| year || '12-'|| year || '11-'|| year || '10-'|| year || '09-'|| year || '08-'|| year || '07';
            ELSIF (SELECT SUBSTRING(peId,5,1) = 'Q') THEN
                IF (SELECT SUBSTRING(peId,6,1) = '3') THEN
                    selectedperiod = year ||'07-' || year || '08-'|| year || '09';
                ELSIF (SELECT SUBSTRING(peId,6,1) = '4') THEN
                    selectedperiod = year ||'07-' || year || '08-'|| year || '09-' || year ||'10-' || year || '11-'|| year || '12';
                ELSIF (SELECT SUBSTRING(peId,6,1) = '1') THEN
                    selectedperiod = year - 1 ||'07-' || year - 1 || '08-'|| year - 1 || '09-' || year - 1 ||'10-' || year - 1 || '11-'|| year - 1 || '12-' || year || '01-'|| year || '02-' || year ||'03';
                ELSIF (SELECT SUBSTRING(peId,6,1) = '2') THEN
                    selectedperiod = year - 1 ||'07-' || year - 1 || '08-'|| year - 1 || '09-' || year - 1 ||'10-' || year - 1 || '11-'|| year - 1 || '12-' || year ||'01-' || year || '02-'|| year || '03-'|| year ||'04-' || year || '05-'|| year || '06';
            
                END IF;
            ELSE
                FOREACH isoperiod IN array string_to_array(year ||'07-' || year || '08-'|| year || '09-'|| year || '10-'|| year || '11-'|| year || '12-'|| year + 1|| '01-'|| year + 1 || '02-'|| year + 1 || '03-'|| year + 1|| '04-'|| year + 1|| '05', '-') LOOP
                    IF isoperiod = peId THEN
                        EXIT;
                    END IF;
                    selectedperiod = selectedperiod || '-' || isoperiod;
                END LOOP;
            END IF;
            INSERT INTO keyjsonvalue(
            keyjsonvalueid, uid, created, lastupdated, namespace, namespacekey, value, encrypted, lastupdatedby)
            SELECT * FROM (SELECT
                    (SELECT max(keyjsonvalueid) FROM keyjsonvalue) + ROW_NUMBER() OVER(),
                    uid(),
                    now(),
                    now(),
                    'notExecuted',
                    recorddata.dataset || '_' || recorddata.ou || '_' || ps.iso as namespaceid,
                    '{}',
                    FALSE,
                    1
                FROM (SELECT unnest(string_to_array(selectedperiod,'-')) iso) ps) as keyjsondata
            WHERE keyjsondata.namespaceid NOT IN (SELECT namespacekey FROM keyjsonvalue WHERE namespace IN ('executed','notExecuted'));
            raise notice 'selectedperiod: % %', recorddata.dataset || '_' || recorddata.ou, selectedperiod;
        END IF;
    END LOOP;

    RETURN results;
END;
$$
LANGUAGE plpgsql;
/*
 call delete function by pass orgunit id  text, text, text,MMhip91li8h text,iLKwCl3Od9c text,rqlTarZRu8L text,koixPT9d3Sr text,FzlzchJ2J7S
*/
--SELECT convertCummulative(2017);

--PGPASSWORD=postgres psql -U postgres -h localhost -d ards -a -f /opt/ards/config/apps/standardreport/src/sql/create_report.sql

--rsync -e 'ssh -p 9037' /opt/ards/config/apps/standardreport/src/sql/create_report.sql vincentminde@hisptz.org:/home/vincentminde/

--PGPASSWORD=postgres psql -U postgres -h localhost -d ards2_29_testing_land -a -f create_report.sql

--'SXvP3NECeFk-deTgGupUgr3','dozTSGrBvVj-wJIxAhejWKY'
-- SELECT * FROM create_report('HhyM40b8ma1','QLoyT2aHGes-oRJJ4PtC7M8-cSC1VV8uMh9', 't6Dw4F5dpgP', '2017Q1');
