#!/bin/bash
set -e

BOLD=1
GREEN=32
RED=31

only=()

color() {
  local color="$1"
  shift
  local message="$@"
  echo -e "\033[0;${color}m${message}\033[0m"
}

contains() {
  local needle="$1"
  shift
  for e in "$@"; do
    [[ "$e" == "$needle" ]] && return 0;
  done
}

fail() {
  >&2 echo "$@"
  exit 1
}

# Parse options
while [[ $# -gt 0 ]]; do
  key="$1"
  [[ "$key" =~ ^- ]] || break
  shift

  case $key in
    -c|--collaborators)
      configure_collaborator=1
    ;;
    -n|--name)
      app_name="$1"
      shift
    ;;
    -o|--only)
      only+=("$1")
      shift
    ;;
  esac
done

csv_file="$1"

# Make sure CSV file is named *.csv and exists
if test -z "$csv_file" || ! [[ "$csv_file" =~ \.csv$ ]]; then
  fail "First argument must be a CSV file"
elif ! test -f "$csv_file"; then
  fail "No such file: $csv_file"
fi

# Read CSV file
echo -n "Reading $(color $BOLD "$csv_file")..."
csv=`cat "$csv_file"|grep @`
echo " $(color $GREEN done)"

OLD_IFS="$IFS"
IFS=$'\n'
for student in $csv; do

  IFS=$','; declare -a fields=($student)
  IFS="$OLD_IFS"

  # Column 0: human-readable name
  name="$(echo "${fields[0]}"|tr -d '[:space:]')"

  # Column 1: email address
  email="$(echo "${fields[1]}"|tr -d '[:space:]')"
  id="$(echo "$email"|sed 's/@.*//'|sed 's/\./-/')"

  # Column 2: virtual machine IP address
  ip="$(echo "${fields[2]}"|tr -d '[:space:]')"

  # Skip other IDs if -o|--only option is specified
  [[ "${#only[@]}" -gt 0 ]] && ! contains "$id" "${only[@]}" && continue

  # Print header with human-readable name
  echo
  echo "$(color $BOLD [${name}])"

  # Create student directory
  echo -n "Creating directory tmp/${id}..."
  mkdir -p "tmp/${id}"
  echo " $(color $GREEN done)"

  # Synchronize /etc directory
  echo -n "Compressing /etc directory..."
  ssh -i id_rsa "ubuntu@${ip}" sudo tar -czf /tmp/etc.tar.gz /etc 2>/dev/null
  echo " $(color $GREEN done)"

  echo -n "Downloading /etc archive..."
  scp -q -i id_rsa "ubuntu@${ip}:/tmp/etc.tar.gz" "tmp/${id}/etc.tar.gz"
  echo " $(color $GREEN done)"

  echo -n "Cleaning up /etc archive..."
  ssh -i id_rsa "ubuntu@${ip}" sudo rm -f /tmp/etc.tar.gz
  echo " $(color $GREEN done)"

  # Synchronize /home directory
  echo -n "Compressing /home directory..."
  ssh -i id_rsa "ubuntu@${ip}" sudo tar -czf /tmp/home.tar.gz /home 2>/dev/null
  echo " $(color $GREEN done)"

  echo -n "Downloading /home archive..."
  scp -q -i id_rsa "ubuntu@${ip}:/tmp/home.tar.gz" "tmp/${id}/home.tar.gz"
  echo " $(color $GREEN done)"

  echo -n "Cleaning up /home archive..."
  ssh -i id_rsa "ubuntu@${ip}" sudo rm -f /tmp/home.tar.gz
  echo " $(color $GREEN done)"

  # List processes
  echo -n "Listing processes..."
  ssh -i id_rsa "ubuntu@${ip}" ps -ef --forest > "tmp/${id}/ps.txt"
  echo " $(color $GREEN done)"

  # List services
  echo -n "Listing services..."
  ssh -i id_rsa "ubuntu@${ip}" sudo systemctl list-units --type=service > "tmp/${id}/services.txt"
  echo " $(color $GREEN done)"

  # List unit files
  echo -n "Listing unit files..."
  ssh -i id_rsa "ubuntu@${ip}" sudo systemctl list-unit-files > "tmp/${id}/unit-files.txt"
  echo " $(color $GREEN done)"

done
IFS="$OLD_IFS"

echo
echo "$(color $GREEN All done!)"
