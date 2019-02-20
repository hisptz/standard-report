DROP FUNCTION IF EXISTS select_table(VARCHAR,VARCHAR);
CREATE OR REPLACE FUNCTION select_table(selected_month VARCHAR,region_name VARCHAR) RETURNS VARCHAR AS $$
DECLARE

	filterparameters VARCHAR;
BEGIN
    filterparameters = selected_month || region_name;
    RAISE NOTICE 'Process for this is % %',selected_month,region_name;
    IF (SELECT EXISTS (SELECT 1 FROM   information_schema.tables WHERE  table_schema = 'public' AND table_name = '_data2')) THEN
        raise notice 'Inserting';
        INSERT INTO _data2
        --CREATE TABLE _data2 as
            SELECT
                filterparameters as filter,
                False as done,
                de1.dataelementid as dx_planted_id,table2.column2 as dx_planted, de1.name as dx_planted_name, co1.categoryoptioncomboid as co_planted_id, table2.column3 as co_planted, co1.name as co_planted_name,
                de2.dataelementid as dx_productivity_id, table2.column4 as dx_productivity, de2.name as dx_productivity_name, co2.categoryoptioncomboid as co_productivity_id, table2.column5 as co_productivity, co2.name as co_productivity_name,
                ou.uid as ou,ou.name as ou_name, district.name as ou_parent_name,region.name as ou_grand_parent_name,
                curr_pe.iso as curr_pe,
                CASE WHEN curr_pe_submission.date IS NULL THEN '0' ELSE '1' END as curr_pe_submission,
                curr_pe_val_planted.value as curr_pe_val_planted, curr_pe_val_productivity.value as curr_pe_val_productivity,
                prev_pe.iso as prev_pe,
                CASE WHEN prev_pe_submission.date IS NULL THEN '0' ELSE '1' END as prev_pe_submission,
                prev_pe_val_planted.value as prev_pe_val_planted, prev_pe_val_productivity.value as prev_pe_val_productivity
            FROM (
                VALUES  ('1','FwpCBGQvYdL','BktmzfgqCjX','ngDrfoi85Oy','BktmzfgqCjX'),('2','FwpCBGQvYdL','Z0LtVda8wAo','ngDrfoi85Oy','Z0LtVda8wAo'),('3','FwpCBGQvYdL','J6W3kbELkGw','ngDrfoi85Oy','J6W3kbELkGw'),('4','FwpCBGQvYdL','mlpia7QBdqY','ngDrfoi85Oy','mlpia7QBdqY'),('5','FwpCBGQvYdL','oS2Oq1evsaK','ngDrfoi85Oy','oS2Oq1evsaK'),('6','FwpCBGQvYdL','bBKFyBvoo34','ngDrfoi85Oy','bBKFyBvoo34'),('7','FwpCBGQvYdL','zSS1gwkIIu8','ngDrfoi85Oy','zSS1gwkIIu8'),('8','sS5OudDzXC2','ql8bSsHEnUN','FyJxMp5u7WP','ql8bSsHEnUN'),('9','sS5OudDzXC2','pcsiYqIW4kJ','FyJxMp5u7WP','pcsiYqIW4kJ'),('10','sS5OudDzXC2','YwRiKDxpYON','FyJxMp5u7WP','YwRiKDxpYON'),('11','sS5OudDzXC2','YkeweM90DZt','FyJxMp5u7WP','YkeweM90DZt'),('12','sS5OudDzXC2','pjXHRQQXIhg','FyJxMp5u7WP','pjXHRQQXIhg'),('13','mVwNk3foz3v','hRHZBt0hok2','cf9SaENrA27','hRHZBt0hok2'),('14','mVwNk3foz3v','r5YXWoMvsX4','cf9SaENrA27','r5YXWoMvsX4'),('15','mVwNk3foz3v','g8e3yoakYec','cf9SaENrA27','g8e3yoakYec'),('16','mVwNk3foz3v','nxSBayfWRix','cf9SaENrA27','nxSBayfWRix'),('17','mVwNk3foz3v','CL9bLTJRESL','cf9SaENrA27','CL9bLTJRESL'),('18','mVwNk3foz3v','JnGowCNPR09','cf9SaENrA27','JnGowCNPR09'),('19','mVwNk3foz3v','nxsGR3eo7aj','cf9SaENrA27','nxsGR3eo7aj'),('20','mVwNk3foz3v','syxO1e4huIX','cf9SaENrA27','syxO1e4huIX'),('21','mVwNk3foz3v','bkfyCurKXWV','cf9SaENrA27','bkfyCurKXWV'),('22','mVwNk3foz3v','ystqt8VT4Tp','cf9SaENrA27','ystqt8VT4Tp'),('23','mVwNk3foz3v','WpsmWKDTfdX','cf9SaENrA27','WpsmWKDTfdX'),('24','mVwNk3foz3v','D116dzscO4G','cf9SaENrA27','D116dzscO4G'),('25','gbvUDbZWxUS','wJIxAhejWKY','dozTSGrBvVj','wJIxAhejWKY'),('26','gbvUDbZWxUS','R5DIMqSCTA5','dozTSGrBvVj','R5DIMqSCTA5'),('27','gbvUDbZWxUS','xCnCQxpSTUJ','dozTSGrBvVj','xCnCQxpSTUJ'),('28','gbvUDbZWxUS','iBa5lgXgvwk','dozTSGrBvVj','iBa5lgXgvwk'),('29','gbvUDbZWxUS','v3Eq35RuqEA','dozTSGrBvVj','v3Eq35RuqEA'),('30','gbvUDbZWxUS','bltcOiiZeO5','dozTSGrBvVj','bltcOiiZeO5'),('31','gbvUDbZWxUS','uMeEFdAzqKS','dozTSGrBvVj','uMeEFdAzqKS'),('32','gbvUDbZWxUS','AqholFtHhlg','dozTSGrBvVj','AqholFtHhlg'),('33','rBstKKNXmYA','jjfebeJ6pbV','QnFeukGopwx','jjfebeJ6pbV'),('34','rBstKKNXmYA','BYTuIQ47dnS','QnFeukGopwx','BYTuIQ47dnS'),('35','rBstKKNXmYA','lJ9Cv8ISZRT','QnFeukGopwx','lJ9Cv8ISZRT'),('36','rBstKKNXmYA','xLi4aE2hf45','QnFeukGopwx','xLi4aE2hf45'),('37','rBstKKNXmYA','eHhQeZB29hz','QnFeukGopwx','eHhQeZB29hz'),('38','rBstKKNXmYA','b5D4IKJFDJH','QnFeukGopwx','b5D4IKJFDJH'),('39','rBstKKNXmYA','vXOb5h9Rxqs','QnFeukGopwx','vXOb5h9Rxqs'),('40','rBstKKNXmYA','OEoQ7kif63L','QnFeukGopwx','OEoQ7kif63L'),('41','bJ84f27rqDB','MT4SwuoV2pQ','qRvbTVEmI6C','MT4SwuoV2pQ'),('42','bJ84f27rqDB','Y1zhvDQTe5e','qRvbTVEmI6C','Y1zhvDQTe5e'),('43','bJ84f27rqDB','Efwc5ipDSTk','qRvbTVEmI6C','Efwc5ipDSTk'),('44','bJ84f27rqDB','WAl6t24Jpzt','qRvbTVEmI6C','WAl6t24Jpzt'),('45','bJ84f27rqDB','uQqzzomp9tc','qRvbTVEmI6C','uQqzzomp9tc'),('46','bJ84f27rqDB','ICiTJsU1Vec','qRvbTVEmI6C','ICiTJsU1Vec'),('47','bJ84f27rqDB','TZJQRkPRJm4','qRvbTVEmI6C','TZJQRkPRJm4'),('48','bJ84f27rqDB','jC7AWcjBkJ3','qRvbTVEmI6C','jC7AWcjBkJ3'),('49','bJ84f27rqDB','BPGkOcPjPS7','qRvbTVEmI6C','BPGkOcPjPS7'),('50','bJ84f27rqDB','nMMaTQxdPJG','qRvbTVEmI6C','nMMaTQxdPJG'),('51','bJ84f27rqDB','HdPaWqoDpdZ','qRvbTVEmI6C','HdPaWqoDpdZ'),('52','YSRj2rXWC0f','tPbRcvnWxkS','xpXXurlwbNM','tPbRcvnWxkS'),('53','YSRj2rXWC0f','fXZ1QJJJ9wp','xpXXurlwbNM','fXZ1QJJJ9wp'),('54','YSRj2rXWC0f','Z4bVJVRPKjl','xpXXurlwbNM','Z4bVJVRPKjl'),('55','YSRj2rXWC0f','pAB6StXtLU8','xpXXurlwbNM','pAB6StXtLU8'),('56','YSRj2rXWC0f','BEi0yw6WwBa','xpXXurlwbNM','BEi0yw6WwBa'),('57','YSRj2rXWC0f','w30fA5rFeRV','xpXXurlwbNM','w30fA5rFeRV'),('58','YSRj2rXWC0f','Bkz2vXNsYke','xpXXurlwbNM','Bkz2vXNsYke'),('59','YSRj2rXWC0f','Heme7D8HT30','xpXXurlwbNM','Heme7D8HT30'),('60','YSRj2rXWC0f','VIPqyvWbwDU','xpXXurlwbNM','VIPqyvWbwDU'),('61','YSRj2rXWC0f','dUIkQFWg2qm','xpXXurlwbNM','dUIkQFWg2qm'),('62','YSRj2rXWC0f','H9p6YVxG7zJ','xpXXurlwbNM','H9p6YVxG7zJ'),('63','YSRj2rXWC0f','JIeF7OCEt6D','xpXXurlwbNM','JIeF7OCEt6D'),('64','YSRj2rXWC0f','bSNT1r88kIC','xpXXurlwbNM','bSNT1r88kIC'),('65','YSRj2rXWC0f','i9b5kFnGOkF','xpXXurlwbNM','i9b5kFnGOkF'),('66','YSRj2rXWC0f','hkdaOo9ZpB2','xpXXurlwbNM','hkdaOo9ZpB2'),('67','YSRj2rXWC0f','rwsWnkaJ5HR','xpXXurlwbNM','rwsWnkaJ5HR'),('68','YSRj2rXWC0f','wTlpU2TaHiz','xpXXurlwbNM','wTlpU2TaHiz'),('69','YSRj2rXWC0f','a4OM9bKggAT','xpXXurlwbNM','a4OM9bKggAT'),('70','WoUIOUcej6W','fuzYIcfLZN2','lcdIDgumilv','fuzYIcfLZN2'),('71','WoUIOUcej6W','HquzVesvM2Z','lcdIDgumilv','HquzVesvM2Z'),('72','WoUIOUcej6W','BJuZMglWlTz','lcdIDgumilv','BJuZMglWlTz'),('73','WoUIOUcej6W','GmO6g98S4G9','lcdIDgumilv','GmO6g98S4G9'),('74','WoUIOUcej6W','wfxDF7iGY3f','lcdIDgumilv','wfxDF7iGY3f'),('75','WoUIOUcej6W','QlQ95KGkgR6','lcdIDgumilv','QlQ95KGkgR6'),('76','WoUIOUcej6W','nrQIoh49aGU','lcdIDgumilv','nrQIoh49aGU'),('77','WoUIOUcej6W','ZbmI2XtXHIS','lcdIDgumilv','ZbmI2XtXHIS'),('78','WoUIOUcej6W','dUwc6pkKgmM','lcdIDgumilv','dUwc6pkKgmM'),('79','WoUIOUcej6W','drXDRIxLVzv','lcdIDgumilv','drXDRIxLVzv'),('80','WoUIOUcej6W','dqChjQjl0ZH','lcdIDgumilv','dqChjQjl0ZH'),('81','WoUIOUcej6W','oplxxXgoehP','lcdIDgumilv','oplxxXgoehP'),('82','WoUIOUcej6W','SyDcaTOW0JP','lcdIDgumilv','SyDcaTOW0JP'),('83','WoUIOUcej6W','XckkuoyUldR','lcdIDgumilv','XckkuoyUldR'),('84','WoUIOUcej6W','GtUrKU93piR','lcdIDgumilv','GtUrKU93piR'),('85','WoUIOUcej6W','Hmz6lySVDCN','lcdIDgumilv','Hmz6lySVDCN'),('86','WoUIOUcej6W','QDSfLpYNZ3l','lcdIDgumilv','QDSfLpYNZ3l'),('87','nc1E1TyiGhG','zPf9YtxdJJH','rNaeaP69Ml0','zPf9YtxdJJH'),('88','nc1E1TyiGhG','D4phPJP6u9V','rNaeaP69Ml0','D4phPJP6u9V'),('89','nc1E1TyiGhG','MvHtsSwbho2','rNaeaP69Ml0','MvHtsSwbho2'),('90','nc1E1TyiGhG','e27Rj8LSYQV','rNaeaP69Ml0','e27Rj8LSYQV'),('91','nc1E1TyiGhG','pq1B5YRvk3w','rNaeaP69Ml0','pq1B5YRvk3w'),('92','nc1E1TyiGhG','hOj19H7Vodn','rNaeaP69Ml0','hOj19H7Vodn'),('93','nc1E1TyiGhG','mQjKnpOz1I8','rNaeaP69Ml0','mQjKnpOz1I8'),('94','uNGeyGIsN7W','deTgGupUgr3','SXvP3NECeFk','deTgGupUgr3')
            ) as table2
            INNER JOIN organisationunit ou ON(ou.hierarchylevel = 4)
            INNER JOIN organisationunit district ON(ou.parentid = district.organisationunitid)
            INNER JOIN organisationunit region ON(district.parentid = region.organisationunitid AND (region_name = '' OR region.name = region_name))
            INNER JOIN dataelement de1 ON(de1.uid=table2.column2)
            INNER JOIN categoryoptioncombo co1 ON(co1.uid=table2.column3)
            INNER JOIN dataelement de2 ON(de2.uid=table2.column4)
            INNER JOIN categoryoptioncombo co2 ON(co2.uid=table2.column5)
            INNER JOIN (
                SELECT _ps.periodid,_ps.iso FROM period
                INNER JOIN _periodstructure _ps USING(periodid)
                INNER JOIN periodtype pt USING(periodtypeid)
                WHERE pt.name = 'Monthly' AND _ps.financialjuly = '2016July' -- AND _ps.iso = selected_month
            ) curr_pe ON(true)
            LEFT JOIN completedatasetregistration curr_pe_submission ON(curr_pe.periodid = curr_pe_submission.periodid AND curr_pe_submission.sourceid = ou.organisationunitid AND curr_pe_submission.datasetid = 1512)
            LEFT JOIN datavalue curr_pe_val_planted ON(curr_pe.periodid = curr_pe_val_planted.periodid AND de1.dataelementid = curr_pe_val_planted.dataelementid AND co1.categoryoptioncomboid = curr_pe_val_planted.categoryoptioncomboid AND ou.organisationunitid = curr_pe_val_planted.sourceid AND curr_pe_val_planted.attributeoptioncomboid = 339884)
            LEFT JOIN datavalue curr_pe_val_productivity ON(curr_pe.periodid = curr_pe_val_productivity.periodid AND de2.dataelementid = curr_pe_val_productivity.dataelementid AND co2.categoryoptioncomboid = curr_pe_val_productivity.categoryoptioncomboid AND ou.organisationunitid = curr_pe_val_productivity.sourceid AND curr_pe_val_productivity.attributeoptioncomboid = 339884)
            --GET Previous Period
            INNER JOIN _periodstructure prev_pe ON(
                CASE WHEN SUBSTRING(curr_pe.iso,5,2) = '01' THEN cast(cast(SUBSTRING(curr_pe.iso,1,4) as integer) - 1 as varchar) || '12' ELSE cast(cast(curr_pe.iso as integer) - 1 as varchar) END
                = prev_pe.iso)
            LEFT JOIN completedatasetregistration prev_pe_submission ON(prev_pe.periodid = prev_pe_submission.periodid AND prev_pe_submission.sourceid = ou.organisationunitid AND curr_pe_submission.datasetid = 1512)
            LEFT JOIN datavalue prev_pe_val_planted ON(prev_pe.periodid = prev_pe_val_planted.periodid AND de1.dataelementid = prev_pe_val_planted.dataelementid AND co1.categoryoptioncomboid = prev_pe_val_planted.categoryoptioncomboid AND ou.organisationunitid = prev_pe_val_planted.sourceid AND prev_pe_val_planted.attributeoptioncomboid = 339884)
            LEFT JOIN datavalue prev_pe_val_productivity ON(prev_pe.periodid = prev_pe_val_productivity.periodid AND de2.dataelementid = prev_pe_val_productivity.dataelementid AND co2.categoryoptioncomboid = prev_pe_val_productivity.categoryoptioncomboid AND ou.organisationunitid = prev_pe_val_productivity.sourceid AND prev_pe_val_productivity.attributeoptioncomboid = 339884)
            ;
        ELSE
            CREATE TABLE _data2 as
            SELECT
                filterparameters as filter,
                False as done,
                de1.dataelementid as dx_planted_id,table2.column2 as dx_planted, de1.name as dx_planted_name, co1.categoryoptioncomboid as co_planted_id, table2.column3 as co_planted, co1.name as co_planted_name,
                de2.dataelementid as dx_productivity_id, table2.column4 as dx_productivity, de2.name as dx_productivity_name, co2.categoryoptioncomboid as co_productivity_id, table2.column5 as co_productivity, co2.name as co_productivity_name,
                ou.uid as ou,ou.name as ou_name, district.name as ou_parent_name,region.name as ou_grand_parent_name,
                curr_pe.iso as curr_pe,
                CASE WHEN curr_pe_submission.date IS NULL THEN '0' ELSE '1' END as curr_pe_submission,
                curr_pe_val_planted.value as curr_pe_val_planted, curr_pe_val_productivity.value as curr_pe_val_productivity,
                prev_pe.iso as prev_pe,
                CASE WHEN prev_pe_submission.date IS NULL THEN '0' ELSE '1' END as prev_pe_submission,
                prev_pe_val_planted.value as prev_pe_val_planted, prev_pe_val_productivity.value as prev_pe_val_productivity
            FROM (
                VALUES  ('1','FwpCBGQvYdL','BktmzfgqCjX','ngDrfoi85Oy','BktmzfgqCjX'),('2','FwpCBGQvYdL','Z0LtVda8wAo','ngDrfoi85Oy','Z0LtVda8wAo'),('3','FwpCBGQvYdL','J6W3kbELkGw','ngDrfoi85Oy','J6W3kbELkGw'),('4','FwpCBGQvYdL','mlpia7QBdqY','ngDrfoi85Oy','mlpia7QBdqY'),('5','FwpCBGQvYdL','oS2Oq1evsaK','ngDrfoi85Oy','oS2Oq1evsaK'),('6','FwpCBGQvYdL','bBKFyBvoo34','ngDrfoi85Oy','bBKFyBvoo34'),('7','FwpCBGQvYdL','zSS1gwkIIu8','ngDrfoi85Oy','zSS1gwkIIu8'),('8','sS5OudDzXC2','ql8bSsHEnUN','FyJxMp5u7WP','ql8bSsHEnUN'),('9','sS5OudDzXC2','pcsiYqIW4kJ','FyJxMp5u7WP','pcsiYqIW4kJ'),('10','sS5OudDzXC2','YwRiKDxpYON','FyJxMp5u7WP','YwRiKDxpYON'),('11','sS5OudDzXC2','YkeweM90DZt','FyJxMp5u7WP','YkeweM90DZt'),('12','sS5OudDzXC2','pjXHRQQXIhg','FyJxMp5u7WP','pjXHRQQXIhg'),('13','mVwNk3foz3v','hRHZBt0hok2','cf9SaENrA27','hRHZBt0hok2'),('14','mVwNk3foz3v','r5YXWoMvsX4','cf9SaENrA27','r5YXWoMvsX4'),('15','mVwNk3foz3v','g8e3yoakYec','cf9SaENrA27','g8e3yoakYec'),('16','mVwNk3foz3v','nxSBayfWRix','cf9SaENrA27','nxSBayfWRix'),('17','mVwNk3foz3v','CL9bLTJRESL','cf9SaENrA27','CL9bLTJRESL'),('18','mVwNk3foz3v','JnGowCNPR09','cf9SaENrA27','JnGowCNPR09'),('19','mVwNk3foz3v','nxsGR3eo7aj','cf9SaENrA27','nxsGR3eo7aj'),('20','mVwNk3foz3v','syxO1e4huIX','cf9SaENrA27','syxO1e4huIX'),('21','mVwNk3foz3v','bkfyCurKXWV','cf9SaENrA27','bkfyCurKXWV'),('22','mVwNk3foz3v','ystqt8VT4Tp','cf9SaENrA27','ystqt8VT4Tp'),('23','mVwNk3foz3v','WpsmWKDTfdX','cf9SaENrA27','WpsmWKDTfdX'),('24','mVwNk3foz3v','D116dzscO4G','cf9SaENrA27','D116dzscO4G'),('25','gbvUDbZWxUS','wJIxAhejWKY','dozTSGrBvVj','wJIxAhejWKY'),('26','gbvUDbZWxUS','R5DIMqSCTA5','dozTSGrBvVj','R5DIMqSCTA5'),('27','gbvUDbZWxUS','xCnCQxpSTUJ','dozTSGrBvVj','xCnCQxpSTUJ'),('28','gbvUDbZWxUS','iBa5lgXgvwk','dozTSGrBvVj','iBa5lgXgvwk'),('29','gbvUDbZWxUS','v3Eq35RuqEA','dozTSGrBvVj','v3Eq35RuqEA'),('30','gbvUDbZWxUS','bltcOiiZeO5','dozTSGrBvVj','bltcOiiZeO5'),('31','gbvUDbZWxUS','uMeEFdAzqKS','dozTSGrBvVj','uMeEFdAzqKS'),('32','gbvUDbZWxUS','AqholFtHhlg','dozTSGrBvVj','AqholFtHhlg'),('33','rBstKKNXmYA','jjfebeJ6pbV','QnFeukGopwx','jjfebeJ6pbV'),('34','rBstKKNXmYA','BYTuIQ47dnS','QnFeukGopwx','BYTuIQ47dnS'),('35','rBstKKNXmYA','lJ9Cv8ISZRT','QnFeukGopwx','lJ9Cv8ISZRT'),('36','rBstKKNXmYA','xLi4aE2hf45','QnFeukGopwx','xLi4aE2hf45'),('37','rBstKKNXmYA','eHhQeZB29hz','QnFeukGopwx','eHhQeZB29hz'),('38','rBstKKNXmYA','b5D4IKJFDJH','QnFeukGopwx','b5D4IKJFDJH'),('39','rBstKKNXmYA','vXOb5h9Rxqs','QnFeukGopwx','vXOb5h9Rxqs'),('40','rBstKKNXmYA','OEoQ7kif63L','QnFeukGopwx','OEoQ7kif63L'),('41','bJ84f27rqDB','MT4SwuoV2pQ','qRvbTVEmI6C','MT4SwuoV2pQ'),('42','bJ84f27rqDB','Y1zhvDQTe5e','qRvbTVEmI6C','Y1zhvDQTe5e'),('43','bJ84f27rqDB','Efwc5ipDSTk','qRvbTVEmI6C','Efwc5ipDSTk'),('44','bJ84f27rqDB','WAl6t24Jpzt','qRvbTVEmI6C','WAl6t24Jpzt'),('45','bJ84f27rqDB','uQqzzomp9tc','qRvbTVEmI6C','uQqzzomp9tc'),('46','bJ84f27rqDB','ICiTJsU1Vec','qRvbTVEmI6C','ICiTJsU1Vec'),('47','bJ84f27rqDB','TZJQRkPRJm4','qRvbTVEmI6C','TZJQRkPRJm4'),('48','bJ84f27rqDB','jC7AWcjBkJ3','qRvbTVEmI6C','jC7AWcjBkJ3'),('49','bJ84f27rqDB','BPGkOcPjPS7','qRvbTVEmI6C','BPGkOcPjPS7'),('50','bJ84f27rqDB','nMMaTQxdPJG','qRvbTVEmI6C','nMMaTQxdPJG'),('51','bJ84f27rqDB','HdPaWqoDpdZ','qRvbTVEmI6C','HdPaWqoDpdZ'),('52','YSRj2rXWC0f','tPbRcvnWxkS','xpXXurlwbNM','tPbRcvnWxkS'),('53','YSRj2rXWC0f','fXZ1QJJJ9wp','xpXXurlwbNM','fXZ1QJJJ9wp'),('54','YSRj2rXWC0f','Z4bVJVRPKjl','xpXXurlwbNM','Z4bVJVRPKjl'),('55','YSRj2rXWC0f','pAB6StXtLU8','xpXXurlwbNM','pAB6StXtLU8'),('56','YSRj2rXWC0f','BEi0yw6WwBa','xpXXurlwbNM','BEi0yw6WwBa'),('57','YSRj2rXWC0f','w30fA5rFeRV','xpXXurlwbNM','w30fA5rFeRV'),('58','YSRj2rXWC0f','Bkz2vXNsYke','xpXXurlwbNM','Bkz2vXNsYke'),('59','YSRj2rXWC0f','Heme7D8HT30','xpXXurlwbNM','Heme7D8HT30'),('60','YSRj2rXWC0f','VIPqyvWbwDU','xpXXurlwbNM','VIPqyvWbwDU'),('61','YSRj2rXWC0f','dUIkQFWg2qm','xpXXurlwbNM','dUIkQFWg2qm'),('62','YSRj2rXWC0f','H9p6YVxG7zJ','xpXXurlwbNM','H9p6YVxG7zJ'),('63','YSRj2rXWC0f','JIeF7OCEt6D','xpXXurlwbNM','JIeF7OCEt6D'),('64','YSRj2rXWC0f','bSNT1r88kIC','xpXXurlwbNM','bSNT1r88kIC'),('65','YSRj2rXWC0f','i9b5kFnGOkF','xpXXurlwbNM','i9b5kFnGOkF'),('66','YSRj2rXWC0f','hkdaOo9ZpB2','xpXXurlwbNM','hkdaOo9ZpB2'),('67','YSRj2rXWC0f','rwsWnkaJ5HR','xpXXurlwbNM','rwsWnkaJ5HR'),('68','YSRj2rXWC0f','wTlpU2TaHiz','xpXXurlwbNM','wTlpU2TaHiz'),('69','YSRj2rXWC0f','a4OM9bKggAT','xpXXurlwbNM','a4OM9bKggAT'),('70','WoUIOUcej6W','fuzYIcfLZN2','lcdIDgumilv','fuzYIcfLZN2'),('71','WoUIOUcej6W','HquzVesvM2Z','lcdIDgumilv','HquzVesvM2Z'),('72','WoUIOUcej6W','BJuZMglWlTz','lcdIDgumilv','BJuZMglWlTz'),('73','WoUIOUcej6W','GmO6g98S4G9','lcdIDgumilv','GmO6g98S4G9'),('74','WoUIOUcej6W','wfxDF7iGY3f','lcdIDgumilv','wfxDF7iGY3f'),('75','WoUIOUcej6W','QlQ95KGkgR6','lcdIDgumilv','QlQ95KGkgR6'),('76','WoUIOUcej6W','nrQIoh49aGU','lcdIDgumilv','nrQIoh49aGU'),('77','WoUIOUcej6W','ZbmI2XtXHIS','lcdIDgumilv','ZbmI2XtXHIS'),('78','WoUIOUcej6W','dUwc6pkKgmM','lcdIDgumilv','dUwc6pkKgmM'),('79','WoUIOUcej6W','drXDRIxLVzv','lcdIDgumilv','drXDRIxLVzv'),('80','WoUIOUcej6W','dqChjQjl0ZH','lcdIDgumilv','dqChjQjl0ZH'),('81','WoUIOUcej6W','oplxxXgoehP','lcdIDgumilv','oplxxXgoehP'),('82','WoUIOUcej6W','SyDcaTOW0JP','lcdIDgumilv','SyDcaTOW0JP'),('83','WoUIOUcej6W','XckkuoyUldR','lcdIDgumilv','XckkuoyUldR'),('84','WoUIOUcej6W','GtUrKU93piR','lcdIDgumilv','GtUrKU93piR'),('85','WoUIOUcej6W','Hmz6lySVDCN','lcdIDgumilv','Hmz6lySVDCN'),('86','WoUIOUcej6W','QDSfLpYNZ3l','lcdIDgumilv','QDSfLpYNZ3l'),('87','nc1E1TyiGhG','zPf9YtxdJJH','rNaeaP69Ml0','zPf9YtxdJJH'),('88','nc1E1TyiGhG','D4phPJP6u9V','rNaeaP69Ml0','D4phPJP6u9V'),('89','nc1E1TyiGhG','MvHtsSwbho2','rNaeaP69Ml0','MvHtsSwbho2'),('90','nc1E1TyiGhG','e27Rj8LSYQV','rNaeaP69Ml0','e27Rj8LSYQV'),('91','nc1E1TyiGhG','pq1B5YRvk3w','rNaeaP69Ml0','pq1B5YRvk3w'),('92','nc1E1TyiGhG','hOj19H7Vodn','rNaeaP69Ml0','hOj19H7Vodn'),('93','nc1E1TyiGhG','mQjKnpOz1I8','rNaeaP69Ml0','mQjKnpOz1I8'),('94','uNGeyGIsN7W','deTgGupUgr3','SXvP3NECeFk','deTgGupUgr3')
            ) as table2
            INNER JOIN organisationunit ou ON(ou.hierarchylevel = 4)
            INNER JOIN organisationunit district ON(ou.parentid = district.organisationunitid)
            INNER JOIN organisationunit region ON(district.parentid = region.organisationunitid AND (region_name = '' OR region.name = region_name))
            INNER JOIN dataelement de1 ON(de1.uid=table2.column2)
            INNER JOIN categoryoptioncombo co1 ON(co1.uid=table2.column3)
            INNER JOIN dataelement de2 ON(de2.uid=table2.column4)
            INNER JOIN categoryoptioncombo co2 ON(co2.uid=table2.column5)
            INNER JOIN (
                SELECT _ps.periodid,_ps.iso FROM period
                INNER JOIN _periodstructure _ps USING(periodid)
                INNER JOIN periodtype pt USING(periodtypeid)
                WHERE pt.name = 'Monthly' AND _ps.financialjuly = '2016July'-- AND _ps.iso = selected_month
            ) curr_pe ON(true)
            LEFT JOIN completedatasetregistration curr_pe_submission ON(curr_pe.periodid = curr_pe_submission.periodid AND curr_pe_submission.sourceid = ou.organisationunitid AND curr_pe_submission.datasetid = 1512)
            LEFT JOIN datavalue curr_pe_val_planted ON(curr_pe.periodid = curr_pe_val_planted.periodid AND de1.dataelementid = curr_pe_val_planted.dataelementid AND co1.categoryoptioncomboid = curr_pe_val_planted.categoryoptioncomboid AND ou.organisationunitid = curr_pe_val_planted.sourceid AND curr_pe_val_planted.attributeoptioncomboid = 339884)
            LEFT JOIN datavalue curr_pe_val_productivity ON(curr_pe.periodid = curr_pe_val_productivity.periodid AND de2.dataelementid = curr_pe_val_productivity.dataelementid AND co2.categoryoptioncomboid = curr_pe_val_productivity.categoryoptioncomboid AND ou.organisationunitid = curr_pe_val_productivity.sourceid AND curr_pe_val_productivity.attributeoptioncomboid = 339884)
            --GET Previous Period
            INNER JOIN _periodstructure prev_pe ON(
                CASE WHEN SUBSTRING(curr_pe.iso,5,2) = '01' THEN cast(cast(SUBSTRING(curr_pe.iso,1,4) as integer) - 1 as varchar) || '12' ELSE cast(cast(curr_pe.iso as integer) - 1 as varchar) END
                = prev_pe.iso)
            LEFT JOIN completedatasetregistration prev_pe_submission ON(prev_pe.periodid = prev_pe_submission.periodid AND prev_pe_submission.sourceid = ou.organisationunitid AND curr_pe_submission.datasetid = 1512)
            LEFT JOIN datavalue prev_pe_val_planted ON(prev_pe.periodid = prev_pe_val_planted.periodid AND de1.dataelementid = prev_pe_val_planted.dataelementid AND co1.categoryoptioncomboid = prev_pe_val_planted.categoryoptioncomboid AND ou.organisationunitid = prev_pe_val_planted.sourceid AND prev_pe_val_planted.attributeoptioncomboid = 339884)
            LEFT JOIN datavalue prev_pe_val_productivity ON(prev_pe.periodid = prev_pe_val_productivity.periodid AND de2.dataelementid = prev_pe_val_productivity.dataelementid AND co2.categoryoptioncomboid = prev_pe_val_productivity.categoryoptioncomboid AND ou.organisationunitid = prev_pe_val_productivity.sourceid AND prev_pe_val_productivity.attributeoptioncomboid = 339884)
            ;

            -- Add a column for the latest submitted data
            ALTER TABLE _data2 ADD COLUMN curr_pe_val_planted_latest_submited varchar;
            ALTER TABLE _data2 ADD COLUMN curr_pe_val_productivity_latest_submited varchar;
            ALTER TABLE _data2 ADD COLUMN prev_pe_val_planted_latest_submited varchar;
            ALTER TABLE _data2 ADD COLUMN prev_pe_val_productivity_latest_submited varchar;

            ALTER TABLE _data2 ADD COLUMN used_01_factor_bool integer;
            ALTER TABLE _data2 ADD COLUMN val_not_from_imm_prev_pe_bool integer;
            ALTER TABLE _data2 ADD COLUMN exponent_diff_curr_prev_val_planted integer;
            ALTER TABLE _data2 ADD COLUMN exponent_diff_curr_prev_val_productivity integer;
            ALTER TABLE _data2 ADD COLUMN converted_curr_pe_val_planted decimal;
            ALTER TABLE _data2 ADD COLUMN converted_curr_pe_val_productivity decimal;
        END IF;
        raise notice 'Done';
    RETURN '';
END;
$$
LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS convert_conversion(VARCHAR,VARCHAR);
CREATE OR REPLACE FUNCTION convert_conversion(selected_month VARCHAR,region_name VARCHAR) RETURNS VARCHAR AS $$
DECLARE
	_c text;
	results VARCHAR;
	filterparameters VARCHAR;
	filename VARCHAR;
	financialjulyname VARCHAR := '2016July';
BEGIN
	BEGIN
    --DROP TABLE IF EXISTS _data2;
    filterparameters = selected_month || region_name;
    IF (SELECT EXISTS (SELECT 1 FROM _data2 WHERE filter = filterparameters)) THEN
        RAISE EXCEPTION 'Process for this is % %',selected_month,region_name;
    END IF;
    --CREATE TABLE _data2 as
    SELECT * INTO results FROM select_table(selected_month, region_name);
        -- WHERE region.name = 'Arusha';--LIMIT 100;

        --ALTER TABLE _data2 ADD COLUMN IF NOT EXISTS curr_pe_latest_submited varchar;
        --ALTER TABLE _data2 ADD COLUMN IF NOT EXISTS prev_pe_latest_submited varchar;
        -- Set planted area and productivity to 0 if it is null and the form has been submitted

        UPDATE _data2 SET curr_pe_val_planted_latest_submited = '0' WHERE curr_pe_submission = '1' AND curr_pe_val_planted_latest_submited is null AND filter = filterparameters;
        UPDATE _data2 SET curr_pe_val_productivity_latest_submited = '0' WHERE curr_pe_submission = '1' AND curr_pe_val_productivity_latest_submited is null AND filter = filterparameters;
        UPDATE _data2 SET prev_pe_val_planted_latest_submited = '0' WHERE prev_pe_submission = '1' AND prev_pe_val_planted_latest_submited is null AND filter = filterparameters;
        UPDATE _data2 SET prev_pe_val_productivity_latest_submited = '0' WHERE prev_pe_submission = '1' AND prev_pe_val_productivity_latest_submited is null AND filter = filterparameters;

        -- Set planted area and productivity to previous values if the form was not submitted
        UPDATE _data2 SET
        curr_pe_latest_submited = (
            SELECT _ps2.iso FROM organisationunit ou
            INNER JOIN _periodstructure _ps ON(_ps.iso = _data2.curr_pe)
            INNER JOIN _periodstructure _ps2 ON(_ps2.startdate <= _ps.enddate AND _ps2.financialjuly = financialjulyname)
            INNER JOIN completedatasetregistration submission ON(_ps2.periodid = submission.periodid AND submission.sourceid = ou.organisationunitid AND submission.datasetid = 1512)
            WHERE _data2.ou = ou.uid
            ORDER BY _ps2.enddate DESC LIMIT 1
        ) WHERE filter = filterparameters;

        -- Set planted area and productivity to previous values if the form was not submitted
        UPDATE _data2 SET
        prev_pe_latest_submited = (
            SELECT _ps2.iso FROM organisationunit ou
            INNER JOIN _periodstructure _ps ON(_ps.iso = _data2.prev_pe)
            INNER JOIN _periodstructure _ps2 ON(_ps2.startdate <= _ps.enddate AND _ps2.financialjuly = financialjulyname)
            INNER JOIN completedatasetregistration submission ON(_ps2.periodid = submission.periodid AND submission.sourceid = ou.organisationunitid AND submission.datasetid = 1512)
            WHERE _data2.ou = ou.uid
            ORDER BY _ps2.enddate DESC LIMIT 1
        )
        WHERE filter = filterparameters;
        -- Set planted area and productivity to previous values if the form was not submitted
        UPDATE _data2 SET
        curr_pe_val_planted_latest_submited = (
            SELECT dv.value FROM datavalue dv
            INNER JOIN organisationunit ou ON(ou.organisationunitid = dv.sourceid AND _data2.ou = ou.uid)
            INNER JOIN _periodstructure _ps ON(_ps.iso = _data2.curr_pe)
            INNER JOIN _periodstructure _ps2 ON(_ps2.startdate <= _ps.enddate AND _ps2.financialjuly = financialjulyname)
            INNER JOIN completedatasetregistration submission ON(_ps2.periodid = submission.periodid AND submission.sourceid = ou.organisationunitid AND submission.datasetid = 1512)
            WHERE dv.dataelementid = dx_planted_id AND dv.categoryoptioncomboid = co_planted_id AND dv.attributeoptioncomboid = 339884
            ORDER BY _ps2.enddate DESC LIMIT 1
        ),
        curr_pe_val_productivity_latest_submited = (
            SELECT dv.value FROM datavalue dv
            INNER JOIN organisationunit ou ON(ou.organisationunitid = dv.sourceid AND _data2.ou = ou.uid)
            INNER JOIN _periodstructure _ps ON(_ps.iso = _data2.curr_pe)
            INNER JOIN _periodstructure _ps2 ON(_ps2.startdate <= _ps.enddate AND _ps2.financialjuly = financialjulyname)
            INNER JOIN completedatasetregistration submission ON(_ps2.periodid = submission.periodid AND submission.sourceid = ou.organisationunitid AND submission.datasetid = 1512)
            WHERE dv.dataelementid = dx_productivity_id AND dv.categoryoptioncomboid = co_productivity_id AND dv.attributeoptioncomboid = 339884
            ORDER BY _ps2.enddate DESC LIMIT 1
        ) WHERE filter = filterparameters;

        -- Set planted area and productivity to previous values if the form was not submitted
        UPDATE _data2 SET
        prev_pe_val_planted_latest_submited = (
            SELECT dv.value FROM datavalue dv
            INNER JOIN organisationunit ou ON(ou.organisationunitid = dv.sourceid AND _data2.ou = ou.uid)
            INNER JOIN _periodstructure _ps ON(_ps.iso = _data2.prev_pe)
            INNER JOIN _periodstructure _ps2 ON(_ps2.startdate <= _ps.enddate AND _ps2.financialjuly = financialjulyname)
            INNER JOIN completedatasetregistration submission ON(_ps2.periodid = submission.periodid AND submission.sourceid = ou.organisationunitid AND submission.datasetid = 1512)
            WHERE dv.dataelementid = dx_planted_id AND dv.categoryoptioncomboid = co_planted_id AND dv.attributeoptioncomboid = 339884
            ORDER BY _ps2.enddate DESC LIMIT 1
        ) ,
        prev_pe_val_productivity_latest_submited = (
            SELECT dv.value FROM datavalue dv
            INNER JOIN organisationunit ou ON(ou.organisationunitid = dv.sourceid AND _data2.ou = ou.uid)
            INNER JOIN _periodstructure _ps ON(_ps.iso = _data2.prev_pe)
            INNER JOIN _periodstructure _ps2 ON(_ps2.startdate <= _ps.enddate AND _ps2.financialjuly = financialjulyname)
            INNER JOIN completedatasetregistration submission ON(_ps2.periodid = submission.periodid AND submission.sourceid = ou.organisationunitid AND submission.datasetid = 1512)
            WHERE dv.dataelementid = dx_productivity_id AND dv.categoryoptioncomboid = co_productivity_id AND dv.attributeoptioncomboid = 339884
            ORDER BY _ps2.enddate DESC LIMIT 1
        )
        WHERE filter = filterparameters;


        -- Perform Adjustment #2:  Fix Same Planted Area but different Productivity -  Add 0.1 to make the planted areas different IF( a1[n]=a1[n-1] AND b1[n]<>b1[n-1] THEN a[n-1] + 0.1 ELSE a1[n] )

        UPDATE _data2 SET curr_pe_val_planted_latest_submited = cast(cast(prev_pe_val_planted_latest_submited as decimal) + 0.1 as varchar), used_01_factor_bool = 1
        WHERE curr_pe_val_planted_latest_submited = prev_pe_val_planted_latest_submited AND curr_pe_val_productivity_latest_submited <> prev_pe_val_productivity_latest_submited
        AND filter = filterparameters;

        -- Update exponential difference for planted area

        UPDATE _data2 SET exponent_diff_curr_prev_val_planted=cast(log(abs(cast(curr_pe_val_planted_latest_submited as decimal) - cast(prev_pe_val_planted_latest_submited as decimal))) as integer) WHERE cast(curr_pe_val_planted_latest_submited as decimal) - cast(prev_pe_val_planted_latest_submited as decimal) <> 0
        AND filter = filterparameters;

        -- Update exponential difference for productivity

        UPDATE _data2 SET exponent_diff_curr_prev_val_productivity=cast(log(abs(cast(curr_pe_val_productivity_latest_submited as decimal) - cast(prev_pe_val_productivity_latest_submited as decimal))) as integer) WHERE cast(curr_pe_val_productivity_latest_submited as decimal) - cast(prev_pe_val_productivity_latest_submited as decimal) <> 0
        AND filter = filterparameters;

        -- Add new data columns



        -- Perform migration of planted area column
        UPDATE _data2 SET converted_curr_pe_val_planted = cast(curr_pe_val_planted_latest_submited as decimal) - cast(prev_pe_val_planted_latest_submited as decimal)
        WHERE filter = filterparameters;

        -- Perform migration of productivity column
        UPDATE _data2 SET converted_curr_pe_val_productivity =
        ((cast(curr_pe_val_planted_latest_submited as decimal) * cast(curr_pe_val_productivity_latest_submited as decimal))
            - (cast(prev_pe_val_planted_latest_submited as decimal) * cast(prev_pe_val_productivity_latest_submited as decimal)))/
        (cast(curr_pe_val_planted_latest_submited as decimal) - cast(prev_pe_val_planted_latest_submited as decimal))
        WHERE cast(curr_pe_val_planted_latest_submited as decimal) - cast(prev_pe_val_planted_latest_submited as decimal) != 0
        AND filter = filterparameters;

        UPDATE _data2 SET done = TRUE WHERE filter = filterparameters;

	EXCEPTION WHEN OTHERS THEN
		GET STACKED DIAGNOSTICS _c = PG_EXCEPTION_CONTEXT;
		RAISE NOTICE 'context: >>%<<', _c;
		--raise notice '% %', SQLERRM, SQLSTATE;
		results := 'Error';
	END;
	RETURN results;

END;
$$
LANGUAGE plpgsql;
/*
 call delete function by pass orgunit id  text, text, text,MMhip91li8h text,iLKwCl3Od9c text,rqlTarZRu8L text,koixPT9d3Sr text,FzlzchJ2J7S
*/
-- SELECT convert_conversion('201607','Arusha');

--PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -a -f src/sql/conversion2.0.sql

--'SXvP3NECeFk-deTgGupUgr3','dozTSGrBvVj-wJIxAhejWKY'

-- COPY (select * from table_name) TO '/tmp/convertedtable_name_arusha_maize.csv' WITH CSV HEADER;

/*
COPY (SELECT 'PGPASSWORD=postgres psql -U postgres -h localhost -d ards_old -c "SELECT convert_conversion('''|| _p.iso || ''',''' || ou.name || ''')" &'
|| CASE WHEN (ROW_NUMBER() OVER()) % 10 = 0 THEN '&' ELSE '' END
FROM _periodstructure _p
INNER JOIN period pe USING(periodid)
INNER JOIN periodtype pt USING(periodtypeid)
INNER JOIN organisationunit ou ON(ou.hierarchylevel = 2)
WHERE financialjuly = '2017July' AND pt.name = 'Monthly'
ORDER BY ou.name,_p.iso) TO '/tmp/runCode2017.sh'  WITH CSV DELIMITER E'\t' QUOTE E'\b' NULL AS '';*/