insert into user(username, password)
values
    ('stephano2013', '93e566f920ff866e3288cfa4b48813588b084d3d15b6e59fe6bb09975a202209');

insert into engine(engine_id, name, picture, colour, courses) 
values
    ('nodejs', 'NodeJS', 'https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg', 'green', 1),
    ('python3', 'Python3', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1024px-Python-logo-notext.svg.png', 'black', 0);

insert into course(course_id, name, engine_id, created_by)
values
    ('12345678', 'Test Course', 'nodejs', 'stephano2013');