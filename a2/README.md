
# QUICKSTART HELP
- Log into the server at : 69.87.218.194 
- log into mongodb:
- useful mongo commands in this context: show databases; | use school; | show collections; | db.students.find();
- In another terminal, tmux or screen session, log into mysql: mysql -u rchaube -p
- useful mysql commands in this context: show databases; | use school; | show tables; | select * from students; | drop database school;
- cd /root/rchaube/a2;
- node a2
- Check to make sure database and tables are created in mysql



# CREDITS:
1. Variety: https://github.com/variety/variety for details on schema analysis
2. Thanks to https://hevodata.com/blog/mongodb-to-mysql/
3. Thanks to the paper and works in Scientific Programming - "Automatic NoSQL to Relational Database Transformation with Dynamic Schema Mapping"- Zain Aftab, Waheed Iqbal ,Khaled Mohamad Almustafa, Faisal Bukhari,Muhammad Abdullah - https://www.hindawi.com/journals/sp/2020/8813350/
4. https://stackoverflow.com/questions/2298870/get-names-of-all-keys-in-the-collection