#include "data_io.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <toml.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>


Configuration readToml(const char *filename) {
  FILE *fp;
  char errbuf[200];

  fp = fopen(filename, "r");
  if (!fp) {
    perror("Cannot open config file");
    exit(1);
  }
  toml_table_t *config = toml_parse_file(fp, errbuf, sizeof(errbuf));
  fclose(fp);
  if (!config) {
    fprintf(stderr, "Error: %s\n", errbuf);
    exit(1);
  }

  Configuration conf;
  toml_datum_t name = toml_string_in(config, "routeDir");
  if (name.ok) {
    strcpy(conf.routesDir, name.u.s);
    free(name.u.s);
  } else {
    fprintf(stderr, "Missing 'routeDir' field\n");
  }

  toml_free(config);
  return conf;
}

void writeTomlFile(const char *filename, Configuration *config) {
  FILE *file = fopen(filename, "w");
  if (!file) {
    perror("File opening failed");
    return;
  }

  fprintf(file, "routeDir = \"%s\"\n", config->routesDir);

  fclose(file);
}

void parseCommand(const char *comment, Command *cmd) {
  strcpy(cmd->endpoint, "");
  strcpy(cmd->method, "");
  strcpy(cmd->resource, "");
  strcpy(cmd->body, "");
  strcpy(cmd->action, "");

  const char *data = comment + 5;

  char *token;
  token = strtok(data, ",");

  int index = 0;
  while (token != NULL) {
    switch (index) {
    case 0:
      strcpy(cmd->endpoint, token);
      break;
    case 1:
      strcpy(cmd->method, token);
      break;
    case 2:
      strcpy(cmd->resource, token);
      break;
    case 3:
      strcpy(cmd->body, token);
      break;
    case 4:
      strcpy(cmd->action, token);
      break;
    default:
      break;
    }
    index++;
    token = strtok(NULL, ",");
  }

  if (strlen(cmd->endpoint) == 0 || strlen(cmd->method) == 0 ||
      strlen(cmd->resource) == 0 || strlen(cmd->body) == 0 ||
      strlen(cmd->action) == 0) {
    fprintf(stderr, "Error: One or more required elements are missing in the "
                    "command string. Run fastx -h show more info.\n");
    exit(1);
  }
}
