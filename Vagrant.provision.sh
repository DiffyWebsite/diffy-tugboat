#filename: Vagrantfile.provision.sh
#!/usr/bin/env bash

###########################################
# by Ricardo Canelas                      #
# https://gist.github.com/ricardocanelas  #
#-----------------------------------------#
# + Apache                                #
# + PHP 7.1                               #
# + MySQL 5.6 or MariaDB 10.1             #
# + NodeJs, Git, Composer, etc...         #
###########################################



# ---------------------------------------------------------------------------------------------------------------------
# Variables & Functions
# ---------------------------------------------------------------------------------------------------------------------
APP_DATABASE_NAME='diffy_marketing'

echoTitle () {
    echo -e "\033[0;30m\033[42m -- $1 -- \033[0m"
}



# ---------------------------------------------------------------------------------------------------------------------
echoTitle 'Virtual Machine Setup'
# ---------------------------------------------------------------------------------------------------------------------
# Update packages
apt-get update -qq
apt-get -y install git curl vim



# ---------------------------------------------------------------------------------------------------------------------
echoTitle 'Installing and Setting: Apache'
# ---------------------------------------------------------------------------------------------------------------------
# Install packages
apt-get install -y apache2

# linking Vagrant directory to Apache 2.4 public directory
# rm -rf /var/www
# ln -fs /vagrant /var/www

# Add ServerName to httpd.conf
echo "ServerName localhost" > /etc/apache2/httpd.conf

# Setup hosts file
VHOST=$(cat <<EOF
    <VirtualHost *:80>
      DocumentRoot "/var/www/web"
      ServerName diffy-marketing.docksal
      ServerAlias diffy-marketing.docksal
      <Directory "/var/www/web">
        AllowOverride All
        Require all granted
      </Directory>
    </VirtualHost>

    <VirtualHost *:80>
      DocumentRoot "/var/xhprof/xhprof_html"
      ServerName xhprof.local
      <Directory "/var/xhprof/xhprof_html">
        AllowOverride All
        Require all granted
      </Directory>
    </VirtualHost>
EOF
)
sudo echo "${VHOST}" > /etc/apache2/sites-enabled/000-default.conf

# Loading needed modules to make apache work
a2enmod rewrite
sudo service apache2 restart



# ---------------------------------------------------------------------------------------------------------------------
# echoTitle 'MYSQL-Database'
# ---------------------------------------------------------------------------------------------------------------------
# Setting MySQL (username: root) ~ (password: password)
sudo debconf-set-selections <<< 'mysql-server-5.7 mysql-server/root_password password password'
sudo debconf-set-selections <<< 'mysql-server-5.7 mysql-server/root_password_again password password'

# Installing packages
apt-get install -y mysql-server-5.7 mysql-client-5.7

# Setup database
mysql -uroot -ppassword -e "CREATE DATABASE IF NOT EXISTS $APP_DATABASE_NAME;";
mysql -uroot -ppassword -e "GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'password';"
mysql -uroot -ppassword -e "GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' IDENTIFIED BY 'password';"

sudo service mysql restart

# Import SQL file
# mysql -uroot -ppassword database < my_database.sql



# ---------------------------------------------------------------------------------------------------------------------
# echoTitle 'Maria-Database'
# ---------------------------------------------------------------------------------------------------------------------
# Remove MySQL if installed
# sudo service mysql stop
# apt-get remove --purge mysql-server-5.6 mysql-client-5.6 mysql-common-5.6
# apt-get autoremove
# apt-get autoclean
# rm -rf /var/lib/mysql/
# rm -rf /etc/mysql/

# Install MariaDB
# export DEBIAN_FRONTEND=noninteractive
# debconf-set-selections <<< 'mariadb-server-10.0 mysql-server/root_password password root'
# debconf-set-selections <<< 'mariadb-server-10.0 mysql-server/root_password_again password root'
# apt-get install -y mariadb-server

# Set MariaDB root user password and persmissions
# mysql -u root -proot -e "GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'root' WITH GRANT OPTION; FLUSH PRIVILEGES;"

# Open MariaDB to be used with Sequel Pro
# sed -i 's|127.0.0.1|0.0.0.0|g' /etc/mysql/my.cnf

# Restart MariaDB
# sudo service mysql restart



# ---------------------------------------------------------------------------------------------------------------------
echoTitle 'Installing: PHP'

# Install packages
apt-get install -y php7.2 php7.2-fpm
apt-get install -y php7.2-mysql
apt-get install -y mcrypt php7.2-mcrypt
apt-get install -y php7.2-cli php7.2-curl php7.2-mbstring php7.2-xml php7.2-mysql
apt-get install -y php7.2-json php7.2-cgi php7.2-gd php-imagick php7.2-bz2 php7.2-zip



# ---------------------------------------------------------------------------------------------------------------------
echoTitle 'Setting: PHP with Apache'
# ---------------------------------------------------------------------------------------------------------------------
apt-get install -y libapache2-mod-php7.2

# Enable php modules
# php71enmod mcrypt (error)

# Trigger changes in apache
a2enconf php7.2-fpm
sudo service apache2 reload

# Packages Available:
# apt-cache search php7-*


# Install drush
sudo apt-get install composer
composer global require drush/drush
wget -O drush.phar https://github.com/drush-ops/drush-launcher/releases/latest/download/drush.phar
chmod +x drush.phar
sudo mv drush.phar /usr/local/bin/drush


## ---------------------------------------------------------------------------------------------------------------------
# echoTitle 'Installing & Setting: X-Debug'
## ---------------------------------------------------------------------------------------------------------------------
# cat << EOF | sudo tee -a /etc/php/7.1/mods-available/xdebug.ini
#zend_extension=xdebug.so
#xdebug.scream=1
#xdebug.cli_color=1
#xdebug.show_local_vars=1
#EOF



# ---------------------------------------------------------------------------------------------------------------------
# Others
# ---------------------------------------------------------------------------------------------------------------------
#echoTitle 'Installing: Node 6 and update NPM'
#curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
#apt-get install -y nodejs
#npm install npm@latest -g

#echoTitle 'Installing: Git'
#apt-get install -y git
#
#echoTitle 'Installing: Composer'
#curl -s https://getcomposer.org/installer | php
#mv composer.phar /usr/local/bin/composer

# ---------------------------------------------------------------------------------------------------------------------
echoTitle 'Install: xhprof'
# ---------------------------------------------------------------------------------------------------------------------
cd /tmp
git clone https://github.com/longxinH/xhprof xhprof
cd xhprof/extension
phpize
./configure --with-php-config=/usr/bin/php-config
sudo make && sudo make install
mkdir /var/tmp/xhprof
chmod 777 /var/tmp/xhprof

mkdir /var/xhprof
cp -r /tmp/xhprof/* /var/xhprof/



# ---------------------------------------------------------------------------------------------------------------------
 echoTitle 'Installing & Setting: X-Debug'
# ---------------------------------------------------------------------------------------------------------------------
 cat << EOF | sudo tee -a /etc/php/7.2/apache2/php.ini
[xhprof]
extension=xhprof.so
xhprof.output_dir="/var/tmp/xhprof"
EOF


# ---------------------------------------------------------------------------------------------------------------------
# echoTitle 'Installing Java and Logstash'
# ---------------------------------------------------------------------------------------------------------------------
#apt-get install default-jre
#add-apt-repository ppa:linuxuprising/java -y
#apt-get update
#apt install oracle-java11-installer -y
#apt install oracle-java11-set-default -y
#
#wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
#apt-get install apt-transport-https -y
#echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-7.x.list
#apt-get update
#apt-get install logstash


# ---------------------------------------------------------------------------------------------------------------------
# Others
# ---------------------------------------------------------------------------------------------------------------------
# Output success message
echoTitle "Your machine has been provisioned"
echo "-------------------------------------------"
echo "MySQL is available on port 3306 with username 'root' and password 'password'"
echo "(you have to use 127.0.0.1 as opposed to 'localhost')"
echo "Apache is available on port 80"
echo -e "Head over to http://192.168.100.107 to get started. http://diffy-marketing.docksal"
