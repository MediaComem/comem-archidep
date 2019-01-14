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

if test -z "$csv_file" || ! [[ "$csv_file" =~ \.csv$ ]]; then
  fail "First argument must be a CSV file"
elif ! test -f "$csv_file"; then
  fail "No such file: $csv_file"
fi

echo -n "Reading $(color $BOLD "$csv_file")..."
csv=`cat "$csv_file"|grep @`
echo " $(color $GREEN done)"

OLD_IFS="$IFS"
IFS=$'\n'
for student in $csv; do

  IFS=$','; declare -a fields=($student)
  IFS="$OLD_IFS"

  name="${fields[0]}"
  email="${fields[1]}"
  heroku_email="$(echo "${fields[2]}"|tr -d '[:space:]')"
  id="$(echo "$email"|sed 's/@.*//'|sed 's/\./-/')"

  if test -z "$heroku_email"; then
    heroku_email="$(echo "$email"|tr -d '[:space:]')"
  fi

  heroku_app="comem-archidep-${id}"
  if test -n "$app_name"; then
    heroku_app="${heroku_app}-${app_name}"
  fi

  [[ "${#only[@]}" -gt 0 ]] && ! contains "$id" "${only[@]}" && continue

  echo
  echo "$(color $BOLD [${name}])"

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
