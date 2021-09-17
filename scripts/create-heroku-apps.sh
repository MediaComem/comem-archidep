#!/bin/bash
set -e

BOLD=1
GREEN=32
RED=31

app_name=""
configure_collaborator=0
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
  name="$(echo "${fields[1]}"|tr -d '[:space:]')"

  # Columns 1-2: unused

  # Column 3: email address
  email="$(echo "${fields[4]}"|tr -d '[:space:]')"

  # Columns 4-5: unused

  # Column 6 (optional): Heroku account email address (if different)
  heroku_email="$(echo "${fields[7]}"|tr -d '[:space:]')"
  id="$(echo "$email"|sed 's/@.*//'|sed 's/\./-/')"

  # Column 7 (optional): custom ID (useful if default ID is too long)
  # The default ID is the name portion of the email address,
  # with dots replaced by hyphens.
  short_id="$(echo "${fields[8]}"|tr -d '[:space:]')"
  if test -n "$short_id"; then
    id="$short_id"
  fi

  # Default Heroku account email address to column 1 email
  if test -z "$heroku_email"; then
    heroku_email="$(echo "$email"|tr -d '[:space:]')"
  fi

  # Build app name from prefix ("ad"), ID and optional suffix (-n|--name option)
  heroku_app="ad-${id}"
  if test -n "$app_name"; then
    heroku_app="${heroku_app}-${app_name}"
  fi

  # Skip other IDs if -o|--only option is specified
  [[ "${#only[@]}" -gt 0 ]] && ! contains "$id" "${only[@]}" && continue

  # Print header with human-readable name
  echo
  echo "$(color $BOLD [${name}])"

  # Create the Heroku application
  echo -n "Checking if app $(color $BOLD "$heroku_app") exists..."
  if heroku apps:info -a "$heroku_app" &>/dev/null; then
    echo " $(color $GREEN yes)"
  else
    echo " $(color $RED no)"

    echo -n "Creating app..."
    if heroku create "$heroku_app" &>/dev/null; then
      echo " $(color $GREEN yes)"
    else
      echo " $(color $RED failed)"
      fail "Could not create app ${heroku_app}"
    fi
  fi

  # Add the Heroku account email as a collaborator (if the -c|--collaborators option is specified)
  if [[ $configure_collaborator -eq 1 ]]; then
    echo -n "Checking if $(color $BOLD "$heroku_email") is a collaborator..."
    if heroku access -a "$heroku_app"|grep "$heroku_email" &>/dev/null; then
      echo " $(color $GREEN yes)"
    else
      echo " $(color $RED no)"

      echo -n "Adding $(color $BOLD "$heroku_email") as a collaborator..."
      if heroku access:add -a "$heroku_app" "$heroku_email" &>/dev/null; then
        echo " $(color $GREEN yes)"
      else
        echo " $(color $RED failed)"
        fail "Could not add collaborator ${heroku_email} to app ${heroku_app}"
      fi
    fi
  fi

done
IFS="$OLD_IFS"

echo
echo "$(color $GREEN All done!)"
