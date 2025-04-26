from setuptools import setup, find_packages

# Read requirements from requirements.txt
with open("requirements.txt", "r") as f:
    install_requires = [
        line.strip() for line in f if line.strip() and not line.startswith("#")
    ]

setup(
    name="regelspraak",
    version="0.2.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=install_requires,
    # Entry point for the CLI command `python -m regelspraak`
    entry_points={
        "console_scripts": [
            "regelspraak=regelspraak.cli:cli",
        ],
    },
    python_requires=">=3.7",
    license="Apache License 2.0",
    description="An ANTLR4-based parser and engine for the RegelSpraak v2.1.0 language.",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/yhavinga/regelspraak-parser",
    author="Yeb Havinga",
    author_email="yhavinga@gmail.com",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: Apache Software License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        # Add more classifiers as appropriate
        "Topic :: Software Development :: Compilers",
        "Topic :: Software Development :: Interpreters",
        "Operating System :: OS Independent",
    ],
    # Optional: Include package data if needed (e.g., non-code files within src/regelspraak)
    # package_data={
    #     'regelspraak': ['some_data_file.json'],
    # },
    package_data={
        "regelspraak": ["_antlr/*.py", "_antlr/*.interp", "_antlr/*.tokens"],
    },
    include_package_data=True,  # Important when using package_data
)
