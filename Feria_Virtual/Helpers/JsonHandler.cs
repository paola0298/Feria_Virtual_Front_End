﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System.Reflection;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace Feria_Virtual.Helpers
{
    public static class JsonHandler
    {
        public static string DataDirectory => "/FeriaVirtual";
        public static string LogFile => "/Logs.txt";

        public static async Task AddToFileAsync<T>(FilePath addTo, T data)
        {
            var filePath = GetPathTo(addTo);

            var fileData = await ReadFileData(filePath).ConfigureAwait(false);

            List<T> listData;

            if (string.IsNullOrWhiteSpace(fileData))
            {
                listData = new List<T>();
            } else
            {
                listData = JsonConvert.DeserializeObject<List<T>>(fileData);
            }

            if (!listData.Contains(data))
                listData.Add(data);

            var contents = JsonConvert.SerializeObject(listData, Formatting.Indented);
            await WriteFileData(filePath, contents).ConfigureAwait(false);
        }

        public static async Task<List<T>> LoadFileAsync<T>(FilePath loadFrom)
        {
            var filePath = GetPathTo(loadFrom);

            var fileData = await ReadFileData(filePath).ConfigureAwait(false);

            if (string.IsNullOrWhiteSpace(fileData))
            {
                return new List<T>();
            }
            else
            {
                return JsonConvert.DeserializeObject<List<T>>(fileData);
            }
        }

        public static async Task OvewriteFileAsync<T>(FilePath toOverwrite, List<T> content)
        {
            var filePath = GetPathTo(toOverwrite);
            var contents = JsonConvert.SerializeObject(content, Formatting.Indented);
            await WriteFileData(filePath, contents).ConfigureAwait(false);
        }

        public static async Task<bool> CheckIfExists<T>(FilePath where, T toAdd, Func<T, T, bool> comparator)
        {
            var filePath = GetPathTo(where);
            var fileData = await ReadFileData(filePath).ConfigureAwait(false);

            if (string.IsNullOrWhiteSpace(fileData))
                return false;

            var listData = JsonConvert.DeserializeObject<List<T>>(fileData);

            return listData.FirstOrDefault(x => comparator.Invoke(x, toAdd) == true) != null;
        }

        private static async Task WriteFileData(string filePath, string contents)
        {
            await File.WriteAllTextAsync(filePath, contents).ConfigureAwait(false);
        }

        private static async Task<string> ReadFileData(string filePath)
        {
            string fileData = null;

            try
            {
                var currentDir = GetDirectory();

                if (!Directory.Exists(currentDir))
                {
                    Directory.CreateDirectory(currentDir);
                }

                fileData = await File.ReadAllTextAsync(filePath).ConfigureAwait(false);
            }
            catch (IOException ex)
            {
                var log = GetDirectory() + LogFile;
                await File.AppendAllTextAsync(log, $"[Warning] {ex.Message} - {ex.StackTrace}\n").ConfigureAwait(false);
            }

            return fileData ?? null;
        }

        private static string GetPathTo(FilePath path)
        {
            string fullPath = GetDirectory();

            if (string.IsNullOrWhiteSpace(fullPath))
                return null;
            
            switch (path)
            {
                case FilePath.Productores:
                    fullPath += "/productores.json";
                    break;
                case FilePath.Productos:
                    fullPath += "/productos.json";
                    break;
                case FilePath.Afiliaciones:
                    fullPath += "/afiliaciones.json";
                    break;
                default:
                    return null;
            }
            return fullPath;
        }

        private static string GetDirectory()
        {
            var currentPath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
            if (string.IsNullOrWhiteSpace(currentPath))
                return null;

            return currentPath + DataDirectory;
        }
    }
}
