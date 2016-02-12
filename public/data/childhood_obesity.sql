SELECT 
    location_name, metric, mean
FROM
    obesity
WHERE
    year = 2013 
    AND age_group_id = 36
	AND sex = 'both'
GROUP BY
	location_name, metric
ORDER BY
	location_name;