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
        --raise notice '% %', recorddata.ou, recorddata.dataset;
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
            FROM _periodstructure ps
            INNER JOIN period p USING(periodid)
            INNER JOIN periodtype pt USING(periodtypeid)
            WHERE (ps.financialjuly = peId OR ps.quarterly = peId OR ps.monthly = peId) AND recorddata.periodtypeid = p.periodtypeid) as keyjsondata
        WHERE keyjsondata.namespaceid NOT IN (SELECT namespacekey FROM keyjsonvalue);
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

--'SXvP3NECeFk-deTgGupUgr3','dozTSGrBvVj-wJIxAhejWKY'
SELECT * FROM create_report('HhyM40b8ma1','QLoyT2aHGes-oRJJ4PtC7M8-cSC1VV8uMh9', 't6Dw4F5dpgP', '2017July');
