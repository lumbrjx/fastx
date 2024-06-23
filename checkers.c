#include <stdio.h>
#include <sys/stat.h>
#include <unistd.h>

// Function to check if a file exists in a directory
int checkFileExists(const char *dirPath, const char *fileName) {
    char filePath[1024]; // Buffer to store full path of the file
    snprintf(filePath, sizeof(filePath), "%s/%s", dirPath, fileName); // Concatenate dirPath with fileName

    // Check if file exists and you can read it
    if (access(filePath, F_OK) != -1) {
        printf("File '%s' found in directory '%s'\n", fileName, dirPath);
        return 1; // File exists
    } else {
        printf("File '%s' not found in directory '%s'\n", fileName, dirPath);
        return 0; // File does not exist
    }
}

