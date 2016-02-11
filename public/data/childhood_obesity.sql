SELECT 
    location_name, mean
FROM
    obesity
WHERE
    year = 2013 
    AND age_group_id = 36
	AND sex = 'both'
	AND metric = 'overweight'
ORDER BY
	location_name;