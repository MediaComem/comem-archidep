#!/bin/bash
set -e

BOLD=1
GREEN=32
RED=31

color() {
  local color="$1"
  shift
  local message="$@"
  echo -e "\033[0;${color}m${message}\033[0m"
}

fail() {
  >&2 echo "$(color $RED "$@")"
  exit 1
}

custom_student_id=
nginx_config_name=locator
repo_name=load-balanceable-locator
subdomain=locator

# Parse options
while [[ $# -gt 0 ]]; do
  key="$1"
  [[ "$key" =~ ^- ]] || break
  shift

  case $key in
    -i|--id)
      custom_student_id="$1"
      shift
    ;;
    -n|--nginx)
      nginx_config_name="$1"
      shift
    ;;
    -r|--repo)
      repo_name="$1"
      shift
    ;;
    -s|--subdomain)
      subdomain="$1"
      shift
    ;;
  esac
done

csv_file="$1"
student="$2"

# Make sure CSV file is named *.csv and exists
if test -z "$csv_file" || ! [[ "$csv_file" =~ \.csv$ ]]; then
  fail "First argument must be a CSV file"
elif ! test -f "$csv_file"; then
  fail "No such file: $csv_file"
elif test -z "$student"; then
  fail "Second argument must be a partial or complete student name or email address"
fi

# Read CSV file
echo -n "Reading $(color $BOLD "$csv_file")..."
csv=`cat "$csv_file"|grep @`
echo " $(color $GREEN done)"

# Make sure at least one student matches the search term
student_data="$(echo "$csv"|grep "$student" || echo -n)"
if test -z "$student_data"; then
  fail "No student matches '$student'"
fi

# Make sure only one student matches the search term
matching_students_count="$(echo "$student_data"|wc -l|tr -d '[:space:]')"
if [[ "$matching_students_count" -gt 1 ]]; then
  fail "Multiple students match '$student' ($matching_students_count)"
fi

student_name="$(echo "$student_data"|cut -d , -f 1)"
student_email="$(echo "$student_data"|cut -d , -f 2)"
ip_address="$(echo $student_data|cut -d , -f 3|tr -d '[:space:]')"

if test -n "$custom_student_id"; then
  student_id="$custom_student_id"
else
  student_id="$(echo "$student_email"|sed 's/@.*//'|tr -d '[:space:]'|sed 's/\./_/')"
fi

student_web_id="$(echo "$student_id"|sed 's/_/-/')"
url="http://${subdomain}.${student_web_id}.archidep-2018.media"
ssh="ssh -i id_rsa ubuntu@$ip_address"

echo
echo "$(color $BOLD "Student:") $student_name"
echo "$(color $BOLD "Email:") $student_email"
echo "$(color $BOLD "IP address:") $ip_address"
echo "$(color $BOLD "Expected URL:") $url"
echo

echo -n "Application is at correct URL:"
if curl 2>/dev/null "$url" | grep "Locator" &>/dev/null; then
  echo " $(color $GREEN yes)"
else
  echo " $(color $RED no)"
fi

echo -n "Application is not available on port 3000:"
if curl 2>/dev/null "$url:3000" | grep "Locator" &>/dev/null; then
  echo " $(color $RED available)"
else
  echo " $(color $GREEN ok)"
fi

echo -n "Application is not available on port 3001:"
if curl 2>/dev/null "$url:3001" | grep "Locator" &>/dev/null; then
  echo " $(color $RED available)"
else
  echo " $(color $GREEN ok)"
fi

echo -n "Repository is cloned:"
if $ssh test -d "/home/${student_id}/${repo_name}/.git"; then
  echo " $(color $GREEN yes)"
else
  echo " $(color $RED no)"
fi

echo -n "Dependencies are installed:"
if $ssh test -d "/home/${student_id}/${repo_name}/node_modules"; then
  echo " $(color $GREEN yes)"
else
  echo " $(color $RED no)"
fi

echo -n "PM2 is installed:"
pm2_installed=`$ssh test -e /usr/bin/pm2 && echo yes || echo -n`
pm2_installed_local=`$ssh test -e /usr/local/bin/pm2 && echo yes || echo -n`
if test -n "$pm2_installed"; then
  echo " $(color $GREEN "$pm2_installed")"
elif test -n "$pm2_installed_local"; then
  echo " $(color $GREEN "$pm2_installed_local")"
else
  echo " $(color $RED no)"
fi

echo -n "PM2 ecosystem file exists:"
ecosystem_file=`$ssh cat "/home/${student_id}/${repo_name}/ecosystem.config.js" 2>/dev/null || echo -n`
if test -n "$ecosystem_file"; then
  echo " $(color $GREEN yes)"
  echo
  echo "$ecosystem_file"
  echo
else
  echo " $(color $RED no)"
fi

echo -n "PM2 hook in place:"
hook_file=`$ssh cat "/etc/systemd/system/pm2-${student_id}.service" 2>/dev/null || echo -n`
if test -n "$hook_file"; then
  echo " $(color $GREEN yes)"
  echo
  echo "$hook_file"
  echo
  $ssh sudo systemctl status "pm2-${student_id}" && echo || echo
else
  echo " $(color $RED no)"
fi

echo -n "nginx configuration enabled:"
link_target=`$ssh readlink -f "/etc/nginx/sites-enabled/${nginx_config_name}" 2>/dev/null || echo -n`
if test -n "$link_target" && [[ "$link_target" == "/etc/nginx/sites-available/${nginx_config_name}" ]]; then
  echo " $(color $GREEN yes)"
else
  echo " $(color $RED no)"
fi

echo
$ssh ls -l /etc/nginx/sites-enabled
echo

echo -n "nginx configuration in place:"
nginx_file=`$ssh cat "/etc/nginx/sites-available/${nginx_config_name}" 2>/dev/null || echo -n`
if test -n "$nginx_file"; then
  echo " $(color $GREEN yes)"
  echo
  echo "$nginx_file"
else
  echo " $(color $RED no)"
fi

echo
echo "$(color $BOLD "SSH command:") $ssh"
echo "$(color $BOLD "Expected URL:") $url"

echo
echo "$(color $GREEN All done!)"
