insert into user_login(user_login_id, user_name, password)
values
    ('1', 'stephano2013', '93e566f920ff866e3288cfa4b48813588b084d3d15b6e59fe6bb09975a202209');

insert into engine(engine_id, name, picture, colour, editor_mode) 
values
    ('nodejs', 'NodeJS', 'https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg', 'green', 'javascript'),
    ('python3', 'Python3', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1024px-Python-logo-notext.svg.png', 'black', 'python'),
    ('mysql', 'MySQL', 'https://www.linuxhispano.net/wp-content/uploads/2012/05/mysql_logo.jpg', 'white', 'sql');

insert into course(course_id, name, engine_id, created_by)
values
    ('12345678', 'Test Course', 'nodejs', '1');

insert into permission(permission_id, description) values ('SUPER_ADMIN', 'All permissions for the SUPER permission group');
insert into security_group(security_group_id, description) values ('SUPER', 'Superuser');
insert into security_group_permission(security_group_id, permission_id) values ('SUPER', 'SUPER_ADMIN');
insert into user_login_security_group(user_login_id, security_group_id) values (1, 'SUPER');

insert into system_property(system_resource_id, system_property_id, system_property_value) values
    ('additionalContext', 'displayDateFormat', 'fullDate'),
    ('additionalContext', 'displayTimeFormat', 'HH:MM:ss'),
    ('additionalContext', 'displayDateTimeFormat', 'dddd, mmmm dS, yyyy, h:MM:ss TT')